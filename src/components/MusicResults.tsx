import Card from "@/components/Card";
import { formatCount, formatDate, formatDuration, type SongResult } from "@/lib/fourget";

export default function MusicResults({ results }: { results: SongResult[] }) {
    if (results.length === 0) {
        return <p className="empty">NO RESULTS</p>;
    }

    return (
        <>
            {results.map((result, index) => {
                const plays = formatCount(result.views);
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
                            plays ? `${plays} PLAYS` : null,
                            formatDate(result.date),
                        ]}
                        description={result.description}
                    />
                );
            })}
        </>
    );
}
