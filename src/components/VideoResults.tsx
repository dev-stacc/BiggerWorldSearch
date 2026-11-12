import Card from "@/components/Card";
import { formatCount, formatDate, formatDuration, type VideoResult } from "@/lib/fourget";

export default function VideoResults({ results }: { results: VideoResult[] }) {
    if (results.length === 0) {
        return <p className="empty">NO RESULTS</p>;
    }

    return (
        <>
            {results.map((result, index) => {
                const views = formatCount(result.views);
                return (
                    <Card
                        key={`${result.url}-${index}`}
                        index={index}
                        title={result.title}
                        url={result.url}
                        thumb={result.thumb?.url}
                        meta={[
                            result.author?.name,
                            formatDuration(result.duration),
                            views ? `${views} VIEWS` : null,
                            formatDate(result.date),
                        ]}
                    />
                );
            })}
        </>
    );
}
