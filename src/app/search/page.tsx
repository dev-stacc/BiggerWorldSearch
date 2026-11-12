import VerticalPage, { type PageParams } from "@/components/VerticalPage";
import WebResults from "@/components/WebResults";
import { isLinkable, type Envelope, type WebResult } from "@/lib/fourget";

export const dynamic = "force-dynamic";

function webOf(envelope: Envelope): WebResult[] {
    return (envelope.web ?? []).filter((item) => isLinkable(item.url));
}

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<PageParams>;
}) {
    const params = await searchParams;

    return (
        <VerticalPage
            vertical="web"
            href="/search"
            params={params}
            more="NEXT PAGE"
            count={(envelope) => webOf(envelope).length}
            render={(envelope) => <WebResults results={webOf(envelope)} />}
        />
    );
}
