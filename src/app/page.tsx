import Shell from "@/components/Shell";
import { filtersFor } from "@/lib/filters";
import { defaultScraperFor } from "@/lib/fourget";

export default function Home() {
    const scraper = defaultScraperFor("web");

    return (
        <Shell
            vertical="web"
            query=""
            telemetry={null}
            scraper={scraper}
            filterDefs={filtersFor("web", scraper)}
            home
        />
    );
}
