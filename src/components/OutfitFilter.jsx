import { useEffect, useRef, useState } from "react";
import { CATEGORIES, FILTER_CATEGORIES } from "../constants/appConstants";

export default function OutfitFilter({ items, filterItemId, onChange, compact = false }) {
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);

  const filterableItems = items.filter((item) => FILTER_CATEGORIES.includes(item.category));
  const filterItem = items.find((item) => item.id === filterItemId);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (filterOpen && filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [filterOpen]);

  if (filterableItems.length === 0) {
    return null;
  }

  return (
    <div className={`outfits-filter ${compact ? "outfits-filter--compact" : ""}`} ref={filterRef}>
      <span className="form-label">Filtrar por prenda</span>
      <button
        type="button"
        className={`outfits-filter__button ${filterOpen ? "is-open" : ""}`}
        onClick={() => setFilterOpen((prev) => !prev)}
        aria-expanded={filterOpen}
      >
        {filterItem ? (
          <>
            <span className="outfits-filter__dot" style={{ background: filterItem.color }} />
            {filterItem.name}
          </>
        ) : (
          "Todas las prendas"
        )}
        <span className="outfits-filter__caret">▾</span>
      </button>

      {filterOpen && (
        <div className="outfits-filter__dropdown">
          <button
            type="button"
            className={`outfits-filter__option ${!filterItemId ? "is-active" : ""}`}
            onClick={() => {
              onChange("");
              setFilterOpen(false);
            }}
          >
            Todas las prendas
          </button>
          {FILTER_CATEGORIES.map((categoryId) => {
            const category = CATEGORIES.find((entry) => entry.id === categoryId);
            const categoryItems = filterableItems.filter((item) => item.category === categoryId);
            if (categoryItems.length === 0) {
              return null;
            }
            return (
              <div key={categoryId} className="outfits-filter__group">
                <div className="outfits-filter__group-label">
                  {category.icon} {category.label}
                </div>
                {categoryItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`outfits-filter__option ${filterItemId === item.id ? "is-active" : ""}`}
                    onClick={() => {
                      onChange(item.id);
                      setFilterOpen(false);
                    }}
                  >
                    <span className="outfits-filter__dot" style={{ background: item.color }} />
                    {item.name}
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
