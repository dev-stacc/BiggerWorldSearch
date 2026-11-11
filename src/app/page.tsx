import Shell from "@/components/Shell";
import { filtersFor } from "@/lib/filters";
import { DEFAULT_SCRAPER } from "@/lib/fourget";

export default function Home() {
    return (
        <Shell
            vertical="web"
            query=""
            telemetry={null}
            scraper={DEFAULT_SCRAPER}
            filterDefs={filtersFor("web", DEFAULT_SCRAPER)}
            home
        />
    );
}
