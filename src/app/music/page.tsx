import VerticalPage, { type PageParams } from "@/components/VerticalPage";
import MusicResults from "@/components/MusicResults";
import { isLinkable, type Envelope, type SongResult } from "@/lib/fourget";

export const dynamic = "force-dynamic";

function songsOf(envelope: Envelope): SongResult[] {
    return [
        ...(envelope.song ?? []),
        ...(envelope.album ?? []),
        ...(envelope.playlist ?? []),
        ...(envelope.podcast ?? []),
    ].filter((item) => isLinkable(item.url));
}

export default async function MusicPage({
    searchParams,
}: {
    searchParams: Promise<PageParams>;
}) {
    const params = await searchParams;

    return (
        <VerticalPage
            vertical="music"
            href="/music"
            params={params}
            more="NEXT PAGE"
            count={(envelope) => songsOf(envelope).length}
            render={(envelope) => <MusicResults results={songsOf(envelope)} />}
        />
    );
}
