import { proxiedImage } from "@/lib/fourget";
import { pad, shortTitle } from "@/lib/text";

export default function Card({
    index,
    title,
    url,
    thumb,
    meta,
    description,
}: {
    index: number;
    title: string;
    url: string;
    thumb?: string | null;
    meta?: (string | null | undefined)[];
    description?: string | null;
}) {
    const parts = (meta ?? []).filter((part): part is string => Boolean(part));

    return (
        <article className="result">
            <div className="src" title={title}>
                <span>{shortTitle(title)}</span>
            </div>
            {thumb ? (
                <span
                    className="thumb"
                    style={{ backgroundImage: `url(${proxiedImage(thumb)})` }}
                />
            ) : null}
            <div className="body">
                <div className="line">
                    <span className="idx">{pad(index)}</span>
                    <a className="url" href={url} rel="noreferrer noopener">
                        {url}
                    </a>
                </div>
                {parts.length > 0 ? (
                    <div className="meta">
                        {parts.map((part, position) => (
                            <span key={`${part}-${position}`}>
                                {position > 0 ? <i>◢</i> : null}
                                {part}
                            </span>
                        ))}
                    </div>
                ) : null}
                {description ? <p className="desc">{description}</p> : null}
            </div>
        </article>
    );
}
