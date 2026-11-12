import VerticalPage, { type PageParams } from "@/components/VerticalPage";
import ImageGrid from "@/components/ImageGrid";
import type { Envelope, ImageResult } from "@/lib/fourget";

export const dynamic = "force-dynamic";

function imagesOf(envelope: Envelope): ImageResult[] {
    return envelope.image ?? [];
}

export default async function ImagesPage({
    searchParams,
}: {
    searchParams: Promise<PageParams>;
}) {
    const params = await searchParams;

    return (
        <VerticalPage
            vertical="images"
            href="/images"
            params={params}
            more="LOAD MORE"
            count={(envelope) => imagesOf(envelope).length}
            render={(envelope) => <ImageGrid results={imagesOf(envelope)} />}
        />
    );
}
