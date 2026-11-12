export const FOURGET_BASE =
    process.env.FOURGET_BASE ?? "http://fourget.fourget.svc.cluster.local";

export const DEFAULT_SCRAPER = process.env.FOURGET_SCRAPER ?? "ddg";

export const VERTICALS = ["web", "images", "videos", "news", "music"] as const;

export type Vertical = (typeof VERTICALS)[number];

export const SCRAPERS_BY_VERTICAL = {
    web: ["ddg", "brave", "startpage", "marginalia", "wiby", "mwmbl"],
    images: ["ddg", "brave", "startpage"],
    videos: [
        "ddg",
        "brave",
        "yt",
        "vimeo",
        "sepiasearch",
        "startpage",
        "yandex",
        "naver",
        "coccoc",
        "purili",
        "solofield",
        "yahoo_japan",
    ],
    news: ["ddg", "brave", "yahoo_japan"],
    music: ["sc"],
} as const satisfies Record<Vertical, readonly string[]>;

export type Scraper = (typeof SCRAPERS_BY_VERTICAL)[Vertical][number];

export function scrapersFor(vertical: Vertical): readonly string[] {
    return SCRAPERS_BY_VERTICAL[vertical];
}

export function defaultScraperFor(vertical: Vertical): string {
    const list = scrapersFor(vertical);
    return list.includes(DEFAULT_SCRAPER)
        ? DEFAULT_SCRAPER
        : (list[0] ?? DEFAULT_SCRAPER);
}

export function resolveScraper(vertical: Vertical, requested: string): string {
    return scrapersFor(vertical).includes(requested)
        ? requested
        : defaultScraperFor(vertical);
}

export interface Thumb {
    ratio: string | null;
    url: string | null;
}

export interface Author {
    name: string | null;
    url: string | null;
    avatar: string | null;
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

export interface VideoResult {
    title: string;
    description: string | null;
    author: Author;
    date: number | null;
    duration: number | null;
    views: number | null;
    thumb: Thumb;
    url: string;
}

export interface NewsResult {
    title: string;
    author: string | null;
    description: string | null;
    date: number | null;
    thumb: Thumb;
    url: string;
}

export interface SongResult {
    title: string;
    description: string | null;
    author: Author;
    date: number | null;
    duration: number | null;
    views: number | null;
    thumb: Thumb;
    url: string;
}

export interface Envelope {
    status: string;
    npt: string | null;
    web?: WebResult[];
    image?: ImageResult[];
    video?: VideoResult[];
    reel?: VideoResult[];
    livestream?: VideoResult[];
    news?: NewsResult[];
    song?: SongResult[];
    playlist?: SongResult[];
    album?: SongResult[];
    podcast?: SongResult[];
    answer?: unknown[];
    related?: string[];
    spelling?: unknown;
}

export interface SearchQuery {
    s: string;
    scraper?: string;
    npt?: string | null;
    filters?: Record<string, string>;
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
    params.set("scraper", query.scraper ?? defaultScraperFor(vertical));
    if (query.npt) {
        params.set("npt", query.npt);
    }
    for (const [key, value] of Object.entries(query.filters ?? {})) {
        params.set(key, value);
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

export function formatDuration(seconds: number | null): string | null {
    if (seconds === null || !Number.isFinite(seconds) || seconds <= 0) {
        return null;
    }
    const total = Math.round(seconds);
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const secs = total % 60;
    const pad = (value: number) => String(value).padStart(2, "0");
    return hours > 0
        ? `${hours}:${pad(minutes)}:${pad(secs)}`
        : `${minutes}:${pad(secs)}`;
}

export function formatCount(value: number | null): string | null {
    if (value === null || !Number.isFinite(value) || value < 0) {
        return null;
    }
    if (value >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
    }
    if (value >= 1_000) {
        return `${(value / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
    }
    return String(value);
}

export function formatDate(unix: number | null): string | null {
    if (unix === null || !Number.isFinite(unix) || unix <= 0) {
        return null;
    }
    return new Date(unix * 1000).toISOString().slice(0, 10);
}

export function isLinkable(url: string): boolean {
    try {
        const parsed = new URL(url);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
        return false;
    }
}
