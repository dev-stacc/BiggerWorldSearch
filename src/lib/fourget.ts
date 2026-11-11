export const FOURGET_BASE =
    process.env.FOURGET_BASE ?? "http://fourget.fourget.svc.cluster.local";

export const DEFAULT_SCRAPER = process.env.FOURGET_SCRAPER ?? "ddg";

export const SCRAPERS = [
    "ddg",
    "brave",
    "startpage",
    "marginalia",
    "wiby",
    "mwmbl",
] as const;

export type Scraper = (typeof SCRAPERS)[number];

export const VERTICALS = ["web", "images", "videos", "news", "music"] as const;

export type Vertical = (typeof VERTICALS)[number];

export interface Thumb {
    ratio: string | null;
    url: string | null;
}

export interface Sublink {
    title: string;
    description: string | null;
    url: string;
}

export interface WebResult {
    title: string;
    description: string | null;
    url: string;
    date: number | null;
    type: string;
    thumb: Thumb;
    sublink: Sublink[];
    table: Record<string, string>;
}

export interface ImageSource {
    url: string;
    width: number;
    height: number;
}

export interface ImageResult {
    title: string;
    source: ImageSource[];
    url: string;
}

export interface Envelope {
    status: string;
    npt: string | null;
    web?: WebResult[];
    image?: ImageResult[];
    video?: unknown[];
    news?: unknown[];
    answer?: unknown[];
    related?: string[];
    spelling?: unknown;
}

export interface SearchQuery {
    s: string;
    scraper?: string;
    npt?: string | null;
}

export interface SearchOutcome {
    envelope: Envelope;
    elapsedMs: number;
    bytes: number;
}

export async function search(
    vertical: Vertical,
    query: SearchQuery,
): Promise<SearchOutcome> {
    const params = new URLSearchParams({ s: query.s });
    params.set("scraper", query.scraper ?? DEFAULT_SCRAPER);
    if (query.npt) {
        params.set("npt", query.npt);
    }

    const started = Date.now();
    const response = await fetch(
        `${FOURGET_BASE}/api/v1/${vertical}?${params.toString()}`,
        { cache: "no-store" },
    );
    const body = await response.text();
    const elapsedMs = Date.now() - started;

    if (!response.ok) {
        throw new Error(`fourget ${vertical} responded ${response.status}`);
    }

    const envelope = JSON.parse(body) as Envelope;
    if (envelope.status !== "ok") {
        throw new Error(`fourget ${vertical} status ${envelope.status}`);
    }

    return { envelope, elapsedMs, bytes: new TextEncoder().encode(body).length };
}

export function proxiedImage(url: string): string {
    return `/img?u=${encodeURIComponent(url)}`;
}

export function upstreamProxy(url: string): string {
    return `${FOURGET_BASE}/proxy?i=${encodeURIComponent(url)}`;
}

export function thumbnailOf(result: ImageResult): ImageSource | null {
    if (result.source.length === 0) {
        return null;
    }
    return result.source.reduce((smallest, candidate) =>
        candidate.width * candidate.height < smallest.width * smallest.height
            ? candidate
            : smallest,
    );
}

export function fullSizeOf(result: ImageResult): ImageSource | null {
    if (result.source.length === 0) {
        return null;
    }
    return result.source.reduce((largest, candidate) =>
        candidate.width * candidate.height > largest.width * largest.height
            ? candidate
            : largest,
    );
}

export function hostOf(url: string): string {
    try {
        return new URL(url).hostname.replace(/^www\./, "");
    } catch {
        return url;
    }
}
