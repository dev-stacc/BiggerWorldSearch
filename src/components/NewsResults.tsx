import Card from "@/components/Card";
import { formatDate, type NewsResult } from "@/lib/fourget";

export default function NewsResults({ results }: { results: NewsResult[] }) {
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
                    meta={[result.author, formatDate(result.date)]}
                    description={result.description}
                />
            ))}
        </>
    );
}
