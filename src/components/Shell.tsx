import Link from "next/link";
import type { ReactNode } from "react";
import Filters from "@/components/Filters";
import Label from "@/components/Label";
import type { FilterDef } from "@/lib/filters";
import { defaultScraperFor, scrapersFor, type Vertical } from "@/lib/fourget";

export interface Telemetry {
    elapsedMs: number;
    count: number;
    scraper: string;
    bytes: number;
}

const TABS: { vertical: Vertical; label: string; abbr: string; href: string }[] = [
    { vertical: "web", label: "WEB", abbr: "WEB", href: "/search" },
    { vertical: "images", label: "IMAGES", abbr: "IMG", href: "/images" },
    { vertical: "videos", label: "VIDEOS", abbr: "VID", href: "/videos" },
    { vertical: "music", label: "MUSIC", abbr: "MUS", href: "/music" },
    { vertical: "news", label: "NEWS", abbr: "NWS", href: "/news" },
];

const ACTIONS: Record<Vertical, string> = {
    web: "/search",
    images: "/images",
    videos: "/videos",
    music: "/music",
    news: "/news",
};

function Rail({ telemetry }: { telemetry: Telemetry | null }) {
    if (!telemetry) {
        return (
            <div className="rail">
                <div className="telemetry">STANDBY</div>
            </div>
        );
    }

    const seconds = (telemetry.elapsedMs / 1000).toFixed(3);
    const kb = (telemetry.bytes / 1024).toFixed(1);

    return (
        <div className="rail">
            <div className="telemetry">
                <b>{seconds}s</b>
                <i>◢</i>
                {telemetry.count} RESULTS
                <i>◢</i>
                {telemetry.scraper.toUpperCase()}
                <i>◢</i>
                {kb}KB
                <i>◢</i>TRACE 0
            </div>
        </div>
    );
}

export default function Shell({
    vertical,
    query,
    telemetry,
    scraper,
    filterDefs = [],
    active = {},
    home = false,
    children,
}: {
    vertical: Vertical;
    query: string;
    telemetry: Telemetry | null;
    scraper?: string;
    filterDefs?: FilterDef[];
    active?: Record<string, string>;
    home?: boolean;
    children?: ReactNode;
}) {
    const current = scraper ?? defaultScraperFor(vertical);

    const carry = (href: string) => {
        if (!query) {
            return href;
        }
        const params = new URLSearchParams({ q: query });
        for (const [key, value] of Object.entries(active)) {
            params.set(key, value);
        }
        return `${href}?${params.toString()}`;
    };

    return (
        <form
            className={home ? "frame home" : "frame"}
            action={ACTIONS[vertical]}
            method="get"
        >
            <i className="cnr tl" />
            <i className="cnr tr" />
            <i className="cnr bl" />
            <i className="cnr br" />

            <div className="head">
                {home ? null : <span className="sigil">4G//NET</span>}
                <input
                    name="q"
                    defaultValue={query}
                    placeholder="query"
                    spellCheck={false}
                    autoComplete="off"
                    autoFocus
                />
            </div>

            {home ? null : <Rail telemetry={telemetry} />}

            {home ? null : <div className="results">{children}</div>}

            <div className="tabs">
                <Filters
                    defs={filterDefs}
                    active={active}
                    scraper={current}
                    scrapers={scrapersFor(vertical)}
                />
                <div className="tabstrip">
                    {TABS.map((tab) => (
                        <Link
                            key={tab.vertical}
                            className={`tab${tab.vertical === vertical ? " on" : ""}`}
                            href={carry(tab.href)}
                        >
                            <Label full={tab.label} abbr={tab.abbr} />
                        </Link>
                    ))}
                </div>
            </div>
        </form>
    );
}
