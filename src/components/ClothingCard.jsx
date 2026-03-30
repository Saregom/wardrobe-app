import { CATEGORIES } from "../constants/appConstants";

export default function ClothingCard({ item, onSelect, selected, onDelete, onEdit }) {
  const category = CATEGORIES.find((entry) => entry.id === item.category);

  return (
    <div
      onClick={() => onSelect && onSelect(item)}
      className={`card clothing-card ${onSelect ? "card--selectable" : ""} ${selected ? "card--selected" : ""}`}
    >
      <div className="clothing-card__preview" style={{ "--item-color": item.color }}>
        {category?.icon || "👕"}
      </div>

      <div>
        <div className="clothing-card__name">{item.name}</div>
        <div className="clothing-card__category">{category?.label}</div>
      </div>

      <div className="clothing-card__color-row">
        <div className="clothing-card__color-dot" style={{ background: item.color }} />
        <span className="clothing-card__color-code">{item.color}</span>
      </div>

      {(onEdit || onDelete) && (
        <div className="card-actions card-actions--compact">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
              className="btn--edit-local"
            >
              ✏ Editar
            </button>
          )}

          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
              className="btn--delete-local"
            >
              ✕ Borrar
            </button>
          )}
        </div>
      )}
    </div>
  );
}
