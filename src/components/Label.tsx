export default function Label({ full, abbr }: { full: string; abbr: string }) {
    return (
        <>
            <span className="full">{full}</span>
            <span className="abbr">{abbr}</span>
        </>
    );
}
