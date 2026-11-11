import { upstreamProxy } from "@/lib/fourget";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
    const target = new URL(request.url).searchParams.get("u");
    if (!target) {
        return new Response("missing u", { status: 400 });
    }

    let parsed: URL;
    try {
        parsed = new URL(target);
    } catch {
        return new Response("malformed u", { status: 400 });
    }

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return new Response("unsupported scheme", { status: 400 });
    }

    const upstream = await fetch(upstreamProxy(target), { cache: "no-store" });
    if (!upstream.ok || !upstream.body) {
        return new Response("upstream failed", { status: 502 });
    }

    const type = upstream.headers.get("content-type") ?? "application/octet-stream";
    if (!type.startsWith("image/")) {
        return new Response("not an image", { status: 415 });
    }

    return new Response(upstream.body, {
        headers: {
            "content-type": type,
            "cache-control": "private, max-age=3600",
            "content-security-policy": "default-src 'none'; sandbox",
        },
    });
}
