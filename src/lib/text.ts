export function pad(index: number): string {
    return String(index + 1).padStart(2, "0");
}

export function shortTitle(title: string): string {
    const head = title.split(/\s+(?:[|–—·]|-|::)\s+/)[0] ?? title;
    const trimmed = head.trim() || title.trim();
    return trimmed.length > 28 ? `${trimmed.slice(0, 27).trimEnd()}…` : trimmed;
}
