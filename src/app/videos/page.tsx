import VerticalPage, { type PageParams } from "@/components/VerticalPage";
import VideoResults from "@/components/VideoResults";
import { isLinkable, type Envelope, type VideoResult } from "@/lib/fourget";

export const dynamic = "force-dynamic";

function videosOf(envelope: Envelope): VideoResult[] {
    return [
        ...(envelope.video ?? []),
        ...(envelope.livestream ?? []),
        ...(envelope.reel ?? []),
    ].filter((item) => isLinkable(item.url));
}

export default async function VideosPage({
    searchParams,
}: {
    searchParams: Promise<PageParams>;
}) {
    const params = await searchParams;

    return (
        <VerticalPage
            vertical="videos"
            href="/videos"
            params={params}
            more="NEXT PAGE"
            count={(envelope) => videosOf(envelope).length}
            render={(envelope) => <VideoResults results={videosOf(envelope)} />}
        />
    );
}
