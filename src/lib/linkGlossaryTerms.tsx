import React from "react";
import { glossaryTerms } from "./glossary";
import GlossaryTooltip from "@/components/ui/GlossaryTooltip";

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const sortedTerms = [...glossaryTerms].sort((a, b) => b.term.length - a.term.length);
const masterPattern = sortedTerms.map((t) => escapeRegex(t.term)).join("|");

/**
 * Scans text for glossary term names and wraps the FIRST occurrence of each
 * with a GlossaryTooltip. Subsequent occurrences and unmatched text pass through untouched.
 */
export function linkGlossaryTerms(text: string): React.ReactNode {
  if (!masterPattern || !text) return text;

  const masterRegex = new RegExp(`\\b(${masterPattern})\\b`, "gi");
  const linked = new Set<string>();
  const result: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = masterRegex.exec(text)) !== null) {
    const matchedText = match[0];
    const glossTerm = sortedTerms.find((t) => t.term.toLowerCase() === matchedText.toLowerCase());

    if (match.index > lastIndex) {
      result.push(text.slice(lastIndex, match.index));
    }

    if (glossTerm && !linked.has(glossTerm.id)) {
      linked.add(glossTerm.id);
      result.push(
        <GlossaryTooltip key={`gt-${key++}`} termId={glossTerm.id}>
          {matchedText}
        </GlossaryTooltip>
      );
    } else {
      result.push(matchedText);
    }

    lastIndex = match.index + matchedText.length;
  }

  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }

  return result;
}
