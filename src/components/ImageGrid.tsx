import {
    fullSizeOf,
    hostOf,
    proxiedImage,
    thumbnailOf,
    type ImageResult,
} from "@/lib/fourget";

export default function ImageGrid({ results }: { results: ImageResult[] }) {
    if (results.length === 0) {
        return <p className="empty">NO RESULTS</p>;
    }

    return (
        <div className="grid">
            {results.map((result, index) => {
                const thumb = thumbnailOf(result);
                const full = fullSizeOf(result);
                if (!thumb || !full) {
                    return null;
                }

                const ratio = thumb.height > 0 ? thumb.width / thumb.height : 1;

                return (
                    <a
                        className="tile"
                        key={`${result.url}-${index}`}
                        href={result.url}
                        rel="noreferrer noopener"
                        style={{ "--ar": ratio } as React.CSSProperties}
                    >
                        <img
                            className="shot"
                            src={proxiedImage(thumb.url)}
                            alt={result.title}
                            loading={index < 12 ? "eager" : "lazy"}
                        />
                        <span className="cap">
                            <span className="t">{result.title}</span>
                            <span className="h">
                                {hostOf(result.url)}{" "}
                                <span className="d">
                                    · {full.width}×{full.height}
                                </span>
                            </span>
                        </span>
                    </a>
                );
            })}
        </div>
    );
}
