import Link from "next/link";
import Shell from "@/components/Shell";
import WebResults from "@/components/WebResults";
import { activeFilters, effectiveFilters, filtersFor } from "@/lib/filters";
import { DEFAULT_SCRAPER, search, type SearchOutcome } from "@/lib/fourget";

export const dynamic = "force-dynamic";

type Params = Promise<Record<string, string | string[] | undefined>>;

function one(value: string | string[] | undefined): string {
    if (Array.isArray(value)) {
        return value[0] ?? "";
    }
    return value ?? "";
}

export default async function SearchPage({ searchParams }: { searchParams: Params }) {
    const params = await searchParams;
    const query = one(params.q);
    const scraper = one(params.scraper) || DEFAULT_SCRAPER;
    const npt = one(params.npt) || null;

    const defs = filtersFor("web", scraper);
    const active = activeFilters(params, defs);
    const effective = effectiveFilters(params, defs);

    if (!query) {
        return (
            <Shell
                vertical="web"
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
        outcome = await search("web", { s: query, scraper, npt, filters: effective });
    } catch (error) {
        failure = error instanceof Error ? error.message : String(error);
    }

    if (!outcome) {
        return (
            <Shell
                vertical="web"
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

    const results = outcome.envelope.web ?? [];
    const next = outcome.envelope.npt;
    const nextParams = new URLSearchParams({ q: query, scraper, ...active });
    if (next) {
        nextParams.set("npt", next);
    }

    return (
        <Shell
            vertical="web"
            query={query}
            scraper={scraper}
            filterDefs={defs}
            active={active}
            telemetry={{
                elapsedMs: outcome.elapsedMs,
                count: results.length,
                scraper,
                bytes: outcome.bytes,
            }}
        >
            <WebResults results={results} />
            {next ? (
                <Link className="more" href={`/search?${nextParams.toString()}`}>
                    ▼ NEXT PAGE ▼
                </Link>
            ) : null}
        </Shell>
    );
}
