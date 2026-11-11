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

export function filtersFor(vertical: Vertical, scraper: string): FilterDef[] {
    const table = vertical === "images" ? IMAGES : WEB;
    return table[scraper as Scraper] ?? [];
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
