import Label from "@/components/Label";
import type { FilterDef } from "@/lib/filters";

export default function Filters({
    defs,
    active,
    scraper,
    scrapers,
}: {
    defs: FilterDef[];
    active: Record<string, string>;
    scraper: string;
    scrapers: readonly string[];
}) {
    return (
        <details className="tab filters">
            <summary>
                <Label full="FILTERS" abbr="FLTR" />
            </summary>
            <div className="panel">
                <div className="row">
                    <span className="key">ENGINE</span>
                    <div className="vals">
                        {scrapers.map((name) => (
                            <label
                                key={name}
                                className={name === scraper ? "pick on" : "pick"}
                            >
                                <input
                                    type="radio"
                                    name="scraper"
                                    value={name}
                                    defaultChecked={name === scraper}
                                />
                                {name.toUpperCase()}
                            </label>
                        ))}
                    </div>
                </div>

                {defs.map((def) => (
                    <div className="row" key={def.param}>
                        <span className="key">{def.label.toUpperCase()}</span>
                        <div className="vals">
                            {def.kind === "date" ? (
                                <input
                                    type="date"
                                    name={def.param}
                                    defaultValue={active[def.param] ?? ""}
                                />
                            ) : (
                                (def.options ?? []).map((option) => {
                                    const current = active[def.param] ?? def.preset;
                                    return (
                                        <label
                                            key={option.value}
                                            className={
                                                option.value === current
                                                    ? "pick on"
                                                    : "pick"
                                            }
                                        >
                                            <input
                                                type="radio"
                                                name={def.param}
                                                value={option.value}
                                                defaultChecked={option.value === current}
                                            />
                                            {option.label}
                                        </label>
                                    );
                                })
                            )}
                        </div>
                    </div>
                ))}

                <button className="apply" type="submit">
                    APPLY
                </button>
            </div>
        </details>
    );
}
