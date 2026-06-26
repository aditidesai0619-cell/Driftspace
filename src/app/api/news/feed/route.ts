import { NextResponse } from "next/server";

export interface NewsArticle {
  id: number | string;
  title: string;
  url: string;
  imageUrl: string;
  newsSite: string;
  summary: string;
  publishedAt: string;
  type: "launch" | "discovery" | "mission" | "science";
}

export interface UpcomingLaunch {
  id: string;
  name: string;
  rocket: string;
  launchSite: string;
  net: string;
  status: "go" | "tbd" | "hold" | "success" | "failure";
  statusName: string;
  agency: string;
  missionType: string;
}

function classifyArticle(title: string, summary: string): NewsArticle["type"] {
  const text = (title + " " + summary).toLowerCase();
  if (text.includes("launch") || text.includes("rocket") || text.includes("liftoff")) return "launch";
  if (text.includes("discover") || text.includes("found") || text.includes("detect")) return "discovery";
  if (text.includes("mission") || text.includes("spacecraft") || text.includes("probe")) return "mission";
  return "science";
}

export async function GET() {
  const [articlesRes, launchesRes] = await Promise.allSettled([
    fetch(
      "https://api.spaceflightnewsapi.net/v4/articles/?limit=20&ordering=-published_at",
      { next: { revalidate: 300 } }
    ),
    fetch(
      "https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=8&mode=detailed",
      { next: { revalidate: 300 } }
    ),
  ]);

  // Articles
  let articles: NewsArticle[] = [];
  if (articlesRes.status === "fulfilled" && articlesRes.value.ok) {
    try {
      const data = await articlesRes.value.json();
      articles = (data.results ?? []).map(
        (a: {
          id: number;
          title: string;
          url: string;
          image_url?: string;
          imageUrl?: string;
          news_site?: string;
          newsSite?: string;
          summary: string;
          published_at?: string;
          publishedAt?: string;
        }) => ({
          id: a.id,
          title: a.title,
          url: a.url,
          imageUrl: a.image_url || a.imageUrl || "",
          newsSite: a.news_site || a.newsSite || "Space News",
          summary: a.summary,
          publishedAt: a.published_at || a.publishedAt || new Date().toISOString(),
          type: classifyArticle(a.title, a.summary),
        })
      );
    } catch {
      // silently fall through
    }
  }

  // Launches
  let launches: UpcomingLaunch[] = [];
  if (launchesRes.status === "fulfilled" && launchesRes.value.ok) {
    try {
      const data = await launchesRes.value.json();
      launches = (data.results ?? []).slice(0, 6).map(
        (l: {
          id: string;
          name: string;
          rocket?: { configuration?: { name?: string } };
          pad?: { location?: { name?: string } };
          net?: string;
          status?: { name?: string; abbrev?: string };
          launch_service_provider?: { name?: string };
          mission?: { type?: string };
        }) => {
          const abbrev = (l.status?.abbrev ?? "").toLowerCase();
          let status: UpcomingLaunch["status"] = "tbd";
          if (abbrev === "go") status = "go";
          else if (abbrev === "tbd" || abbrev === "tbc") status = "tbd";
          else if (abbrev === "hold") status = "hold";
          else if (abbrev === "success") status = "success";
          else if (abbrev === "failure") status = "failure";
          return {
            id: l.id,
            name: l.name ?? "Unknown Mission",
            rocket: l.rocket?.configuration?.name ?? "Unknown Rocket",
            launchSite: l.pad?.location?.name ?? "Unknown Site",
            net: l.net ?? new Date(Date.now() + 86400000).toISOString(),
            status,
            statusName: l.status?.name ?? "TBD",
            agency: l.launch_service_provider?.name ?? "Unknown Agency",
            missionType: l.mission?.type ?? "Unknown",
          };
        }
      );
    } catch {
      // silently fall through
    }
  }

  // NASA APOD
  let apod: { title: string; explanation: string; url: string; hdurl?: string; mediaType: string; date: string } | null = null;
  try {
    const key = process.env.NASA_API_KEY || "DEMO_KEY";
    const apodRes = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${key}`, {
      next: { revalidate: 3600 },
    });
    if (apodRes.ok) {
      const d = await apodRes.json();
      apod = {
        title: d.title,
        explanation: d.explanation,
        url: d.url,
        hdurl: d.hdurl,
        mediaType: d.media_type,
        date: d.date,
      };
    }
  } catch {
    // silently fall through
  }

  return NextResponse.json({ articles, launches, apod });
}
