import { CATEGORIES } from "../constants/appConstants";

export default function OutfitCard({ outfit, items, onSelect, selected, onDelete, onEdit }) {
  const outfitItems = outfit.itemIds.map((id) => items.find((item) => item.id === id)).filter(Boolean);

  return (
    <div
      onClick={() => onSelect && onSelect(outfit)}
      className={`card ${onSelect ? "card--selectable" : ""} ${selected ? "card--selected" : ""}`}
    >
      <div className="outfit-card__name">{outfit.name}</div>

      <div className="outfit-card__tags" style={{ marginBottom: outfitItems.length > 0 && (onEdit || onDelete) ? 10 : 0 }}>
        {outfitItems.length === 0 ? (
          <span className="outfit-card__empty">Sin prendas</span>
        ) : (
          outfitItems.map((item) => (
            <span key={item.id} className="outfit-card__tag" style={{ "--item-color": item.color }}>
              <span className="outfit-card__tag-dot" style={{ background: item.color }} />
              {CATEGORIES.find((entry) => entry.id === item.category)?.icon} {item.name}
            </span>
          ))
        )}
      </div>

      {(onEdit || onDelete) && (
        <div className="card-actions">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(outfit);
              }}
              className="btn btn--ghost btn--small"
            >
              ✏ Editar
            </button>
          )}

          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(outfit.id);
              }}
              className="btn btn--ghost btn--danger-soft btn--small"
            >
              ✕ Borrar
            </button>
          )}
        </div>
      )}
    </div>
  );
}
