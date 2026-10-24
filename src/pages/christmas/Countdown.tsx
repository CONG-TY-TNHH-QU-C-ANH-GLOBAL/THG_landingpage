import { useI18n } from "@/lib/i18n";
import "@/lib/i18n/translations/christmas";
import { pad2, type Countdown as CountdownValue } from "./christmasData";

const UNITS = [
    ["days", "christmas.cd_days"],
    ["hours", "christmas.cd_hours"],
    ["minutes", "christmas.cd_minutes"],
    ["seconds", "christmas.cd_seconds"],
] as const;

export function Countdown({ value, big }: Readonly<{ value: CountdownValue | null; big?: boolean }>) {
    const { t } = useI18n();
    if (value?.done) return <p className="cd-done">{t("christmas.cd_done")}</p>;
    return (
        // Not a live region: announcing every second would drown out a screen reader.
        <div className={`cd-row${big ? " big" : ""}`} role="timer" aria-label={t("christmas.cd_label")}>
            {UNITS.map(([unit, labelKey]) => (
                <div className="cd-cell" key={unit}>
                    <b>{value ? pad2(value[unit]) : "--"}</b>
                    <span>{t(labelKey)}</span>
                </div>
            ))}
        </div>
    );
}
