import Link from "next/link";
import type { ReactNode } from "react";
import Filters from "@/components/Filters";
import type { FilterDef } from "@/lib/filters";
import { DEFAULT_SCRAPER, type Vertical } from "@/lib/fourget";

export interface Telemetry {
    elapsedMs: number;
    count: number;
    scraper: string;
    bytes: number;
}

const WIRED: Vertical[] = ["web", "images"];

const TABS: { vertical: Vertical; label: string; href: string }[] = [
    { vertical: "web", label: "WEB", href: "/search" },
    { vertical: "images", label: "IMAGES", href: "/images" },
    { vertical: "videos", label: "VIDEOS", href: "/videos" },
    { vertical: "music", label: "MUSIC", href: "/music" },
    { vertical: "news", label: "NEWS", href: "/news" },
];

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
    scraper = DEFAULT_SCRAPER,
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
    const action = vertical === "images" ? "/images" : "/search";

    const carry = (href: string) => {
        if (!query) {
            return href;
        }
        const params = new URLSearchParams({ q: query, scraper });
        for (const [key, value] of Object.entries(active)) {
            params.set(key, value);
        }
        return `${href}?${params.toString()}`;
    };

    return (
        <form className={home ? "frame home" : "frame"} action={action} method="get">
            <i className="cnr tl" />
            <i className="cnr tr" />
            <i className="cnr bl" />
            <i className="cnr br" />

            <div className="head">
                <span className="sigil">4G//NET</span>
                <span className="caret" />
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
                <Filters defs={filterDefs} active={active} scraper={scraper} />
                {TABS.map((tab) => {
                    const className = `tab${tab.vertical === vertical ? " on" : ""}`;
                    if (!WIRED.includes(tab.vertical)) {
                        return (
                            <span key={tab.vertical} className={`${className} off`}>
                                {tab.label}
                            </span>
                        );
                    }
                    return (
                        <Link
                            key={tab.vertical}
                            className={className}
                            href={carry(tab.href)}
                        >
                            {tab.label}
                        </Link>
                    );
                })}
            </div>
        </form>
    );
}
