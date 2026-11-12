import Link from "next/link";
import type { ReactNode } from "react";
import Shell from "@/components/Shell";
import { activeFilters, effectiveFilters, filtersFor } from "@/lib/filters";
import {
    resolveScraper,
    search,
    type Envelope,
    type SearchOutcome,
    type Vertical,
} from "@/lib/fourget";

export type PageParams = Record<string, string | string[] | undefined>;

function one(value: string | string[] | undefined): string {
    if (Array.isArray(value)) {
        return value[0] ?? "";
    }
    return value ?? "";
}

export default async function VerticalPage({
    vertical,
    href,
    params,
    more,
    render,
    count,
}: {
    vertical: Vertical;
    href: string;
    params: PageParams;
    more: string;
    render: (envelope: Envelope) => ReactNode;
    count: (envelope: Envelope) => number;
}) {
    const query = one(params.q);
    const scraper = resolveScraper(vertical, one(params.scraper));
    const npt = one(params.npt) || null;

    const defs = filtersFor(vertical, scraper);
    const active = activeFilters(params, defs);
    const effective = effectiveFilters(params, defs);

    if (!query) {
        return (
            <Shell
                vertical={vertical}
                query=""
                telemetry={null}
                scraper={scraper}
                filterDefs={defs}
                active={active}
                home
            />
        );
    }

    let outcome: SearchOutcome | null = null;
    let failure: string | null = null;

    try {
        outcome = await search(vertical, {
            s: query,
            scraper,
            npt,
            filters: effective,
        });
    } catch (error) {
        failure = error instanceof Error ? error.message : String(error);
    }

    if (!outcome) {
        return (
            <Shell
                vertical={vertical}
                query={query}
                telemetry={null}
                scraper={scraper}
                filterDefs={defs}
                active={active}
            >
                <p className="empty">UPSTREAM FAILURE — {failure}</p>
            </Shell>
        );
    }

    const next = outcome.envelope.npt;
    const nextParams = new URLSearchParams({ q: query, scraper, ...active });
    if (next) {
        nextParams.set("npt", next);
    }

    return (
        <Shell
            vertical={vertical}
            query={query}
            scraper={scraper}
            filterDefs={defs}
            active={active}
            telemetry={{
                elapsedMs: outcome.elapsedMs,
                count: count(outcome.envelope),
                scraper,
                bytes: outcome.bytes,
            }}
        >
            {render(outcome.envelope)}
            {next ? (
                <Link className="more" href={`${href}?${nextParams.toString()}`}>
                    ▼ {more} ▼
                </Link>
            ) : null}
        </Shell>
    );
}
