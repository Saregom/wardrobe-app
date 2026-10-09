import { useMemo, useState } from "react";
import OutfitCard from "../components/OutfitCard";
import OutfitFilter from "../components/OutfitFilter";

const PERIODS = [
  { id: "1w", label: "Última semana", days: 7 },
  { id: "2w", label: "Últimas 2 semanas", days: 14 },
  { id: "3w", label: "Últimas 3 semanas", days: 21 },
  { id: "4w", label: "Últimas 4 semanas", days: 28 },
  { id: "1m", label: "Último mes", months: 1 },
  { id: "2m", label: "Últimos 2 meses", months: 2 },
  { id: "3m", label: "Últimos 3 meses", months: 3 },
  { id: "4m", label: "Últimos 4 meses", months: 4 },
  { id: "5m", label: "Últimos 5 meses", months: 5 },
  { id: "6m", label: "Últimos 6 meses", months: 6 },
  { id: "7m", label: "Últimos 7 meses", months: 7 },
  { id: "8m", label: "Últimos 8 meses", months: 8 },
  { id: "9m", label: "Últimos 9 meses", months: 9 },
  { id: "10m", label: "Últimos 10 meses", months: 10 },
  { id: "11m", label: "Últimos 11 meses", months: 11 },
  { id: "12m", label: "Últimos 12 meses", months: 12 },
];

const SORT_OPTIONS = [
  { id: "recent", label: "Más recientes" },
  { id: "oldest", label: "Más antiguos" },
  { id: "used", label: "Más usados" },
  { id: "unused", label: "Menos usados" },
];

function parseDateKey(key) {
  const [y, m, d] = key.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function getRange(period) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  if (period.days) {
    start.setDate(start.getDate() - period.days + 1);
  } else if (period.months) {
    start.setMonth(start.getMonth() - period.months);
  }
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end, today };
}

function formatDayChip(date) {
  const weekday = date
    .toLocaleDateString("es-CO", { weekday: "short" })
    .replace(".", "");
  const day = date.getDate();
  const month = date
    .toLocaleDateString("es-CO", { month: "short" })
    .replace(".", "");
  return `${weekday} ${day} ${month}`;
}

function formatFull(date) {
  return date.toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export default function RankingPage({ items, outfits, schedule }) {
  const [periodId, setPeriodId] = useState("4w");
  const [sortMode, setSortMode] = useState("recent");
  const [filterItemId, setFilterItemId] = useState("");

  const period = PERIODS.find((p) => p.id === periodId) || PERIODS[3];

  const stats = useMemo(() => {
    const { start, end } = getRange(period);

    const byOutfit = new Map();
    Object.entries(schedule || {}).forEach(([dateKey, outfitId]) => {
      const date = parseDateKey(dateKey);
      if (!date) return;
      if (date < start || date > end) return;
      if (!byOutfit.has(outfitId)) byOutfit.set(outfitId, []);
      byOutfit.get(outfitId).push({ key: dateKey, date });
    });

    let list = outfits.map((outfit) => {
      const uses = (byOutfit.get(outfit.id) || []).sort((a, b) => b.date - a.date);
      return {
        outfit,
        count: uses.length,
        dates: uses,
        lastUsed: uses.length > 0 ? uses[0].date : null,
        lastUsedKey: uses.length > 0 ? uses[0].key : null,
      };
    });

    if (filterItemId) {
      list = list.filter((entry) => entry.outfit.itemIds.includes(filterItemId));
    }

    const sorted = [...list];
    switch (sortMode) {
      case "recent":
        sorted.sort((a, b) => {
          if (!a.lastUsed && !b.lastUsed) return b.count - a.count;
          if (!a.lastUsed) return 1;
          if (!b.lastUsed) return -1;
          return b.lastUsed - a.lastUsed || b.count - a.count;
        });
        break;
      case "oldest":
        sorted.sort((a, b) => {
          if (!a.lastUsed && !b.lastUsed) return a.count - b.count;
          if (!a.lastUsed) return 1;
          if (!b.lastUsed) return -1;
          return a.lastUsed - b.lastUsed || a.count - b.count;
        });
        break;
      case "used":
        sorted.sort((a, b) => b.count - a.count || (b.lastUsed || 0) - (a.lastUsed || 0));
        break;
      case "unused":
        sorted.sort((a, b) => a.count - b.count || (a.lastUsed || 0) - (b.lastUsed || 0));
        break;
      default:
        break;
    }

    return { list: sorted, range: getRange(period) };
  }, [schedule, outfits, period, sortMode, filterItemId]);

  const totalUses = stats.list.reduce((acc, entry) => acc + entry.count, 0);
  const rangeLabel = `${stats.range.start.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
  })} – ${stats.range.end.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;

  return (
    <div className="ranking-page">
      <div className="page-heading">
        <div>
          <h2 className="page-heading__title">Ranking de Outfits</h2>
          <p className="page-heading__meta">
            {totalUses} usos en el periodo · {rangeLabel}
          </p>
        </div>
      </div>

      <div className="ranking-controls">
        <div className="ranking-controls__group">
          <label className="form-label" htmlFor="ranking-period">
            Periodo
          </label>
          <select
            id="ranking-period"
            className="ranking-controls__select"
            value={periodId}
            onChange={(e) => setPeriodId(e.target.value)}
          >
            {PERIODS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div className="ranking-controls__group">
          <span className="form-label">Ordenar</span>
          <div className="ranking-controls__sort" role="tablist" aria-label="Orden del ranking">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                role="tab"
                aria-selected={sortMode === opt.id}
                className={`ranking-controls__sort-btn ${sortMode === opt.id ? "is-active" : ""}`}
                onClick={() => setSortMode(opt.id)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <OutfitFilter items={items} filterItemId={filterItemId} onChange={setFilterItemId} />

      {outfits.length === 0 ? (
        <div className="empty-state">Primero crea outfits en Mis Outfits</div>
      ) : stats.list.length === 0 ? (
        <div className="empty-state">No hay outfits que incluyan esa prenda</div>
      ) : (
        <div className="ranking-list">
          {stats.list.map((entry, index) => (
            <div key={entry.outfit.id} className="ranking-row">
              <div className="ranking-row__position" aria-hidden="true">
                #{index + 1}
              </div>
              <div className="ranking-row__card">
                <OutfitCard outfit={entry.outfit} items={items} />
              </div>
              <div className="ranking-row__meta">
                <span
                  className={`ranking-row__count ${entry.count === 0 ? "is-zero" : ""}`}
                  title={`${entry.count} veces usado en ${period.label.toLowerCase()}`}
                >
                  ◷ {entry.count} {entry.count === 1 ? "vez" : "veces"}
                </span>
                {entry.count > 0 ? (
                  <>
                    <span className="ranking-row__last" title={formatFull(entry.lastUsed)}>
                      Último uso: {formatDayChip(entry.lastUsed)}
                    </span>
                    <div className="ranking-row__dates">
                      {entry.dates.map(({ key, date }) => (
                        <span key={key} className="ranking-row__chip" title={date.toLocaleDateString("es-CO", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}>
                          {formatDayChip(date)}
                        </span>
                      ))}
                    </div>
                  </>
                ) : (
                  <span className="ranking-row__empty">Sin uso en este periodo</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="ranking-footnote">Solo cuenta usos hasta hoy, sin incluir días futuros.</p>
    </div>
  );
}
