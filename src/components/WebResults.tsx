import Card from "@/components/Card";
import type { WebResult } from "@/lib/fourget";

export default function WebResults({ results }: { results: WebResult[] }) {
    if (results.length === 0) {
        return <p className="empty">NO RESULTS</p>;
    }

    return (
        <>
            {results.map((result, index) => (
                <Card
                    key={`${result.url}-${index}`}
                    index={index}
                    title={result.title}
                    url={result.url}
                    thumb={result.thumb?.url}
                    description={result.description}
                />
            ))}
        </>
    );
}
