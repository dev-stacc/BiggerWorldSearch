import VerticalPage, { type PageParams } from "@/components/VerticalPage";
import NewsResults from "@/components/NewsResults";
import { isLinkable, type Envelope, type NewsResult } from "@/lib/fourget";

export const dynamic = "force-dynamic";

function newsOf(envelope: Envelope): NewsResult[] {
    return (envelope.news ?? []).filter((item) => isLinkable(item.url));
}

export default async function NewsPage({
    searchParams,
}: {
    searchParams: Promise<PageParams>;
}) {
    const params = await searchParams;

    return (
        <VerticalPage
            vertical="news"
            href="/news"
            params={params}
            more="NEXT PAGE"
            count={(envelope) => newsOf(envelope).length}
            render={(envelope) => <NewsResults results={newsOf(envelope)} />}
        />
    );
}
