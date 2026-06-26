import { CohereClient } from "cohere-ai";
import { NextRequest, NextResponse } from "next/server";
import { topics } from "@/lib/topics";
import { catalogObjects } from "@/lib/catalog";
import { glossaryTerms } from "@/lib/glossary";

const co = new CohereClient({ token: process.env.COHERE_API_KEY });

const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query?.trim()) {
      return NextResponse.json({ found: false, query: "", description: "Empty search." });
    }

    const cacheKey = JSON.stringify({ query: query.trim().toLowerCase() });
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data);
    }

    const topicList = topics.map((t) => `${t.slug}: ${t.name}`).join(", ");
    const catalogList = catalogObjects
      .map((o) => `${o.id}: ${o.name} (${o.type}${o.parentBody ? ", " + o.parentBody : ""})`)
      .join(", ");
    const glossaryList = glossaryTerms.map((g) => `${g.id}: ${g.term}`).join(", ");

    const response = await co.chat({
      model: "command-r-plus-08-2024",
      preamble:
        "You are a precise search assistant for a space science platform. Return ONLY valid JSON — no markdown, no code blocks.",
      message: `The user searched for: "${query}".

Your job is to identify EXACTLY what they are looking for — be precise.
If they search for a moon, return that moon. If they search for a planet, return that planet. Do not redirect to a parent body.

LEARNING TOPICS (slug: name):
${topicList}

CATALOG OBJECTS (id: name, type, optional parent):
${catalogList}

GLOSSARY TERMS (id: term):
${glossaryList}

Rules:
1. First check EXACT or CLOSE matches against catalog objects by name — catalog objects are individual specific bodies (moons, specific stars, spacecraft, etc.)
2. Then check if it matches a glossary term — glossary terms are concepts/definitions (e.g. "event horizon", "redshift", "supernova" as a general concept)
3. Then check if it matches a learning topic
4. If it matches a catalog object → return: { "found": true, "source": "catalog", "id": "matching-id", "confidence": "exact" or "close", "contextNote": "one punchy sentence of context, e.g. Largest moon of Jupiter · Has its own magnetic field" }
5. If it matches a glossary term → return: { "found": true, "source": "glossary", "id": "matching-id", "confidence": "exact" or "close", "contextNote": "one punchy sentence of context" }
6. If it matches a learning topic → return: { "found": true, "source": "topic", "slug": "matching-slug", "confidence": "exact" or "close", "contextNote": "one punchy sentence of context" }
7. If it matches NONE of the above → return: { "found": false, "query": "${query}", "type": "moon|planet|star|nebula|galaxy|spacecraft|other", "parentBody": "parent body name if applicable or null", "description": "2-3 sentence accurate description of what they searched for", "relatedSlugs": ["up to 3 relevant topic slugs from the list"], "relatedCatalogIds": ["up to 3 relevant catalog IDs from the list"] }

CRITICAL: Never substitute a parent body for a specific object. If they search "Ganymede", return Ganymede (catalog id: ganymede), NOT Jupiter. If they search "Europa moon", return Europa (catalog id: europa). If they search a general concept like "event horizon" or "dark matter" prefer the glossary term over a learning topic when both could apply.

Return ONLY valid JSON, no markdown.`,
      maxTokens: 300,
    });

    const text = response.text ?? "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({
        found: false,
        query,
        type: "other",
        description:
          "We couldn't identify that object precisely. Try searching for a specific planet, star, or phenomenon.",
        relatedSlugs: ["big-bang", "milky-way", "stellar-evolution"],
        relatedCatalogIds: ["james-webb", "hubble", "sirius"],
      });
    }

    const result = JSON.parse(jsonMatch[0]);
    cache.set(cacheKey, { data: result, timestamp: Date.now() });
    return NextResponse.json(result);
  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json(
      { found: false, query: "", description: "Search failed.", relatedSlugs: [], relatedCatalogIds: [] },
      { status: 500 }
    );
  }
}
