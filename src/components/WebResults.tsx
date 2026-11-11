import { proxiedImage, type WebResult } from "@/lib/fourget";

function pad(index: number): string {
    return String(index + 1).padStart(2, "0");
}

function shortTitle(title: string): string {
    const head = title.split(/\s+(?:[|–—·]|-|::)\s+/)[0] ?? title;
    const trimmed = head.trim() || title.trim();
    return trimmed.length > 28 ? `${trimmed.slice(0, 27).trimEnd()}…` : trimmed;
}

export default function WebResults({ results }: { results: WebResult[] }) {
    if (results.length === 0) {
        return <p className="empty">NO RESULTS</p>;
    }

    return (
        <>
            {results.map((result, index) => (
                <article className="result" key={`${result.url}-${index}`}>
                    <div className="src" title={result.title}>
                        <span>{shortTitle(result.title)}</span>
                    </div>
                    {result.thumb?.url ? (
                        <span
                            className="thumb"
                            style={{
                                backgroundImage: `url(${proxiedImage(result.thumb.url)})`,
                            }}
                        />
                    ) : null}
                    <div className="body">
                        <div className="line">
                            <span className="idx">{pad(index)}</span>
                            <a
                                className="url"
                                href={result.url}
                                rel="noreferrer noopener"
                            >
                                {result.url}
                            </a>
                        </div>
                        {result.description ? (
                            <p className="desc">{result.description}</p>
                        ) : null}
                    </div>
                </article>
            ))}
        </>
    );
}
