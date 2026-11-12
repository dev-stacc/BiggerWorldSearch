import type { Scraper, Vertical } from "@/lib/fourget";

export interface FilterOption {
    value: string;
    label: string;
}

export interface FilterDef {
    param: string;
    label: string;
    kind: "select" | "date";
    options?: FilterOption[];
    fallback: string;
    preset: string;
}

function sel(
    param: string,
    label: string,
    pairs: [string, string][],
    preset?: string,
): FilterDef {
    const options = pairs.map(([value, text]) => ({ value, label: text }));
    const fallback = options[0]?.value ?? "";
    return {
        param,
        label,
        kind: "select",
        options,
        fallback,
        preset: preset ?? fallback,
    };
}

function day(param: string, label: string): FilterDef {
    return { param, label, kind: "date", fallback: "", preset: "" };
}

const YESNO: [string, string][] = [
    ["no", "No"],
    ["yes", "Yes"],
];

const GATE: [string, string][] = [
    ["any", "Allow"],
    ["deny", "Deny"],
    ["require", "Require"],
];

const NSFW_TRI = sel("nsfw", "NSFW", [
    ["yes", "Yes"],
    ["maybe", "Maybe"],
    ["no", "No"],
]);

const NSFW_BI = sel("nsfw", "NSFW", [
    ["yes", "Yes"],
    ["no", "No"],
]);

const NEWER = day("newer", "Newer than");
const OLDER = day("older", "Older than");

const WEB: Partial<Record<Scraper, FilterDef[]>> = {
    ddg: [NSFW_TRI, NEWER, OLDER],
    brave: [NSFW_TRI, NEWER, OLDER, sel("spellcheck", "Spellcheck", YESNO, "yes")],
    startpage: [
        NSFW_BI,
        sel("time", "Time posted", [
            ["any", "Any time"],
            ["d", "Past 24 hours"],
            ["w", "Past week"],
            ["m", "Past month"],
            ["y", "Past year"],
        ]),
    ],
    wiby: [
        NSFW_BI,
        sel("date", "Time posted", [
            ["any", "Any time"],
            ["day", "Past day"],
            ["week", "Past week"],
            ["month", "Past month"],
            ["year", "Past year"],
        ]),
    ],
    marginalia: [
        sel("adtech", "Reduce adtech", YESNO, "yes"),
        sel("trackers", "Trackers", GATE, "deny"),
        sel("cookies", "Cookies", GATE, "deny"),
        sel("affiliate", "Affiliate links", GATE, "deny"),
        sel("javascript", "Javascript", GATE),
        sel("recent", "Recent results", YESNO),
        sel("format", "Format", [
            ["any", "Any format"],
            ["html5", "html5"],
            ["xhtml", "xhtml"],
            ["html123", "html123"],
        ]),
        sel("file", "Filetype", [
            ["any", "Any filetype"],
            ["nomedia", "Deny media"],
            ["media", "Contains media"],
            ["audio", "Contains audio"],
            ["video", "Contains video"],
            ["archive", "Contains archive"],
            ["document", "Contains document"],
        ]),
    ],
    mwmbl: [],
};

const IMAGES: Partial<Record<Scraper, FilterDef[]>> = {
    ddg: [
        NSFW_BI,
        sel("date", "Time posted", [
            ["any", "Any time"],
            ["Day", "Past day"],
            ["Week", "Past week"],
            ["Month", "Past month"],
        ]),
        sel("size", "Size", [
            ["any", "Any size"],
            ["Small", "Small"],
            ["Medium", "Medium"],
            ["Large", "Large"],
            ["Wallpaper", "Wallpaper"],
        ]),
        sel("type", "Type", [
            ["any", "All types"],
            ["photo", "Photograph"],
            ["clipart", "Clipart"],
            ["gif", "Animated GIF"],
            ["transparent", "Transparent"],
        ]),
        sel("layout", "Layout", [
            ["any", "All layouts"],
            ["Square", "Square"],
            ["Tall", "Tall"],
            ["Wide", "Wide"],
        ]),
        sel("license", "License", [
            ["any", "All licenses"],
            ["Any", "All Creative Commons"],
            ["Public", "Public domain"],
            ["Share", "Free to share"],
            ["ShareCommercially", "Free to share commercially"],
            ["Modify", "Free to modify"],
            ["ModifyCommercially", "Free to modify commercially"],
        ]),
    ],
    startpage: [
        NSFW_BI,
        sel("type", "Type", [
            ["any", "All types"],
            ["Photo", "Photograph"],
            ["Clipart", "Clipart"],
            ["Line", "Line drawing"],
            ["AnimatedGif", "Animated GIF"],
            ["Transparent", "Transparent"],
        ]),
        sel("license", "License", [
            ["any", "All licenses"],
            ["p", "Public domain"],
            ["s", "Free to share"],
            ["sc", "Free to share commercially"],
            ["m", "Free to modify"],
            ["mc", "Free to modify commercially"],
        ]),
    ],
    brave: [NSFW_TRI, sel("spellcheck", "Spellcheck", YESNO, "yes")],
};

const VIDEOS: Partial<Record<Scraper, FilterDef[]>> = {
    ddg: [
        NSFW_TRI,
        sel("date", "Time fetched", [
            ["any", "Any time"],
            ["d", "Past day"],
            ["w", "Past week"],
            ["m", "Past month"],
        ]),
        sel("resolution", "Resolution", [
            ["any", "Any resolution"],
            ["high", "High definition"],
            ["standard", "Standard definition"],
        ]),
        sel("duration", "Duration", [
            ["any", "Any duration"],
            ["short", "Short (<5min)"],
            ["medium", "Medium (5-20min)"],
            ["long", "Long (>20min)"],
        ]),
        sel("license", "License", [
            ["any", "Any license"],
            ["creativeCommon", "Creative Commons"],
            ["youtube", "YouTube Standard"],
        ]),
    ],
    brave: [NSFW_TRI, sel("spellcheck", "Spellcheck", YESNO, "yes")],
    yt: [
        sel("date", "Time posted", [
            ["any", "Any time"],
            ["hour", "Last hour"],
            ["today", "Today"],
            ["week", "This week"],
            ["month", "This month"],
            ["year", "This year"],
        ]),
        sel("type", "Type", [
            ["video", "Video"],
            ["channel", "Channel"],
            ["playlist", "Playlist"],
            ["Movie", "Movie"],
        ]),
        sel("duration", "Duration", [
            ["any", "Any duration"],
            ["short", "Short (<4min)"],
            ["medium", "Medium (4-20min)"],
            ["long", "Long (>20min)"],
        ]),
        sel(
            "feature",
            "Feature",
            [
                ["360", "VR 360°"],
                ["any", "No features"],
                ["live", "Live"],
                ["4k", "4K"],
                ["hd", "HD"],
                ["subtitles", "Subtitles/CC"],
                ["creativecommons", "Creative Commons"],
                ["vr180", "VR 180°"],
                ["3d", "3D"],
                ["hdr", "HDR"],
            ],
            "any",
        ),
        sel("sort", "Sort by", [
            ["relevance", "Relevance"],
            ["upload_date", "Upload date"],
            ["view_count", "View count"],
            ["rating", "Rating"],
        ]),
    ],
    vimeo: [
        sel("time", "Date uploaded", [
            ["any", "Any time"],
            ["today", "Last 24 hours"],
            ["this-week", "Last 7 days"],
            ["this-month", "Last 30 days"],
            ["this-year", "Last 365 days"],
        ]),
        sel("display", "Display", [
            ["video", "Videos"],
            ["ondemand", "On-Demand"],
            ["people", "People"],
            ["channel", "Channels"],
            ["group", "Groups"],
        ]),
        sel("sort", "Sort by", [
            ["relevance", "Relevance"],
            ["recent", "Newest"],
            ["popular", "Most popular"],
            ["longest", "Longest"],
            ["shortest", "Shortest"],
        ]),
        sel("duration", "Duration", [
            ["any", "Any duration"],
            ["short", "Short (<4min)"],
            ["medium", "Medium (4-10min)"],
            ["long", "Long (>10min)"],
        ]),
        sel("resolution", "Resolution", [
            ["any", "Any resolution"],
            ["4k", "4K"],
        ]),
        sel("price", "Price", [
            ["any", "Any price"],
            ["free", "Free"],
            ["paid", "Paid"],
        ]),
        sel(
            "vimeo_360",
            "Vimeo 360°",
            [
                ["360", "360°"],
                ["any", "Any"],
                ["spatial", "Spatial"],
            ],
            "any",
        ),
        sel("license", "License", [
            ["any", "Any license"],
            ["cc0", "CC0"],
            ["by", "CC BY"],
            ["by-sa", "CC BY-SA"],
            ["by-nc", "CC BY-NC"],
            ["by-nd", "CC BY-ND"],
            ["by-nc-sa", "CC BY-NC-SA"],
            ["by-nc-nd", "CC BY-NC-ND"],
        ]),
    ],
    sepiasearch: [
        NSFW_BI,
        sel("type", "Result type", [
            ["videos", "Videos"],
            ["playlists", "Playlists"],
            ["channels", "Channels"],
        ]),
        sel("sort", "Sort by", [
            ["best", "Best match"],
            ["-publishedAt", "Newest"],
            ["publishedAt", "Oldest"],
        ]),
        sel("duration", "Duration", [
            ["any", "Any duration"],
            ["short", "Short (0-4min)"],
            ["medium", "Medium (4-10min)"],
            ["long", "Long (10min+)"],
        ]),
        sel("display", "Display", [
            ["any", "Everything"],
            ["true", "Live videos"],
            ["false", "VODs"],
        ]),
        sel(
            "license",
            "License",
            [
                ["1", "Attribution"],
                ["2", "Attribution - Share Alike"],
                ["3", "Attribution - No Derivatives"],
                ["4", "Attribution - Non Commercial"],
                ["5", "Attribution - NC - Share Alike"],
                ["6", "Attribution - NC - No Derivatives"],
                ["7", "Public Domain Dedication"],
                ["any", "Any license"],
            ],
            "any",
        ),
        NEWER,
    ],
    startpage: [
        NSFW_BI,
        sel("sort", "Sort by", [
            ["relevance", "Most relevant"],
            ["popular", "Most popular"],
            ["recent", "Most recent"],
        ]),
        sel("duration", "Duration", [
            ["any", "Any duration"],
            ["short", "Short"],
            ["medium", "Medium"],
            ["long", "Long"],
        ]),
    ],
    yandex: [
        NSFW_TRI,
        sel(
            "time",
            "Time posted",
            [
                ["9", "Recently"],
                ["any", "Any time"],
            ],
            "any",
        ),
        sel("duration", "Duration", [
            ["any", "Any duration"],
            ["short", "Short"],
        ]),
    ],
    naver: [
        sel("time", "Time", [
            ["any", "Any time"],
            ["1day", "Last day"],
            ["1week", "Last week"],
            ["1month", "Last month"],
            ["3month", "Last 3 months"],
            ["6month", "Last 6 months"],
            ["1year", "Last year"],
        ]),
        sel("sort", "Sort by", [
            ["rel", "Relevance"],
            ["date", "Most recent"],
            ["playcount", "Most views"],
        ]),
        sel("type", "Type", [
            ["any", "Any videos"],
            ["shorts", "Shorts"],
        ]),
        sel("duration", "Duration", [
            ["any", "Any duration"],
            ["0:600", "Under 10 minutes"],
            ["601:1800", "10-30 minutes"],
            ["1801:3600", "30-60 minutes"],
            ["3601:65535", "Over 1 hour"],
        ]),
    ],
    coccoc: [
        NSFW_BI,
        sel("time", "Time posted", [
            ["any", "Any time"],
            ["1w", "1 week ago"],
            ["2w", "2 weeks ago"],
            ["1m", "1 month ago"],
            ["3m", "3 months ago"],
            ["6m", "6 months ago"],
            ["1Y", "1 year ago"],
        ]),
        sel("filter", "Remove duplicates", YESNO),
    ],
    solofield: [NSFW_BI],
    purili: [],
    yahoo_japan: [],
};

const NEWS: Partial<Record<Scraper, FilterDef[]>> = {
    ddg: [
        NSFW_TRI,
        sel("date", "Time posted", [
            ["any", "Any time"],
            ["d", "Past day"],
            ["w", "Past week"],
            ["m", "Past month"],
        ]),
    ],
    brave: [NSFW_TRI, sel("spellcheck", "Spellcheck", YESNO, "yes")],
    yahoo_japan: [],
};

const MUSIC: Partial<Record<Scraper, FilterDef[]>> = {
    sc: [
        sel("type", "Type", [
            ["any", "Any type"],
            ["track", "Tracks"],
            ["author", "People"],
            ["album", "Albums"],
            ["playlist", "Playlists"],
            ["goplus", "Go+ Tracks"],
        ]),
    ],
};

const TABLES: Record<Vertical, Partial<Record<Scraper, FilterDef[]>>> = {
    web: WEB,
    images: IMAGES,
    videos: VIDEOS,
    news: NEWS,
    music: MUSIC,
};

export function filtersFor(vertical: Vertical, scraper: string): FilterDef[] {
    return TABLES[vertical][scraper as Scraper] ?? [];
}

function resolve(
    params: Record<string, string | string[] | undefined>,
    def: FilterDef,
): string {
    const raw = params[def.param];
    const value = Array.isArray(raw) ? raw[0] : raw;
    return value ?? def.preset;
}

export function activeFilters(
    params: Record<string, string | string[] | undefined>,
    defs: FilterDef[],
): Record<string, string> {
    const active: Record<string, string> = {};
    for (const def of defs) {
        const value = resolve(params, def);
        if (value !== def.preset) {
            active[def.param] = value;
        }
    }
    return active;
}

export function effectiveFilters(
    params: Record<string, string | string[] | undefined>,
    defs: FilterDef[],
): Record<string, string> {
    const effective: Record<string, string> = {};
    for (const def of defs) {
        const value = resolve(params, def);
        if (value !== "" && value !== def.fallback) {
            effective[def.param] = value;
        }
    }
    return effective;
}
