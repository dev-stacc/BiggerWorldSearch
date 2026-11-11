# BiggerWorldSearch

Search frontend for the cluster's 4get instance. Queries 4get's versioned
`/api/v1/*` JSON API server-side and renders its own UI; no fork, no scrapers.

## Running

```
nix develop
npm install
FOURGET_BASE=https://search.tail789d60.ts.net npm run dev
```

## Environment

| Variable          | Default                                    |
| ----------------- | ------------------------------------------ |
| `FOURGET_BASE`    | `http://fourget.fourget.svc.cluster.local` |
| `FOURGET_SCRAPER` | `ddg`                                      |

## Routes

| Route      | Purpose                                     |
| ---------- | ------------------------------------------- |
| `/`        | Empty search box                            |
| `/search`  | Web results, `?q=` `&scraper=` `&npt=`      |
| `/images`  | Image results, same parameters              |
| `/img`     | Server-side image proxy, `?u=<encoded url>` |
| `/healthz` | Liveness probe                              |

Image thumbnails are fetched through `/img`, which forwards to 4get's `/proxy`.
Nothing in a result page causes the browser to contact an upstream image host,
so 4get can stay cluster-internal with no ingress of its own.

Verticals beyond web and images are rendered as inactive tabs until wired.
