import Link from "next/link";
import Shell from "@/components/Shell";
import ImageGrid from "@/components/ImageGrid";
import { DEFAULT_SCRAPER, search, type SearchOutcome } from "@/lib/fourget";

export const dynamic = "force-dynamic";

type Params = Promise<Record<string, string | string[] | undefined>>;

function one(value: string | string[] | undefined): string {
    if (Array.isArray(value)) {
        return value[0] ?? "";
    }
    return value ?? "";
}

export default async function ImagesPage({ searchParams }: { searchParams: Params }) {
    const params = await searchParams;
    const query = one(params.q);
    const scraper = one(params.scraper) || DEFAULT_SCRAPER;
    const npt = one(params.npt) || null;

    if (!query) {
        return <Shell vertical="images" query="" telemetry={null} home />;
    }

    let outcome: SearchOutcome | null = null;
    let failure: string | null = null;

    try {
        outcome = await search("images", { s: query, scraper, npt });
    } catch (error) {
        failure = error instanceof Error ? error.message : String(error);
    }

    if (!outcome) {
        return (
            <Shell vertical="images" query={query} telemetry={null}>
                <p className="empty">UPSTREAM FAILURE — {failure}</p>
            </Shell>
        );
    }

    const results = outcome.envelope.image ?? [];
    const next = outcome.envelope.npt;

    return (
        <Shell
            vertical="images"
            query={query}
            telemetry={{
                elapsedMs: outcome.elapsedMs,
                count: results.length,
                scraper,
                bytes: outcome.bytes,
            }}
        >
            <ImageGrid results={results} />
            {next ? (
                <Link
                    className="more"
                    href={`/images?q=${encodeURIComponent(query)}&scraper=${scraper}&npt=${encodeURIComponent(next)}`}
                >
                    ▼ LOAD MORE ▼
                </Link>
            ) : null}
        </Shell>
    );
}
