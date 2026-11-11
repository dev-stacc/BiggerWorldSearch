import { hostOf, proxiedImage, type WebResult } from "@/lib/fourget";

function pad(index: number): string {
    return String(index + 1).padStart(2, "0");
}

export default function WebResults({ results }: { results: WebResult[] }) {
    if (results.length === 0) {
        return <p className="empty">NO RESULTS</p>;
    }

    return (
        <>
            {results.map((result, index) => (
                <article className="result" key={`${result.url}-${index}`}>
                    <div className="src">
                        <span>{hostOf(result.url)}</span>
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
                                className="title"
                                href={result.url}
                                rel="noreferrer noopener"
                            >
                                {result.title}
                            </a>
                            <span className="url">{result.url}</span>
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
