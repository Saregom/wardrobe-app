import { useEffect, useRef, useState } from "react";
import { generateId, CATEGORIES } from "../constants/appConstants";
import OutfitCard from "../components/OutfitCard";
import OutfitForm from "../components/OutfitForm";
import ConfirmDialog from "../components/ConfirmDialog";

const FILTER_CATEGORIES = ["camisas", "pantalones", "sacos", "chaquetas"];

export default function OutfitsPage({ items, outfits, setOutfits }) {
  const [showForm, setShowForm] = useState(false);
  const [editOutfit, setEditOutfit] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [filterItemId, setFilterItemId] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const formAnchorRef = useRef(null);
  const filterRef = useRef(null);
  const pendingDeleteOutfit = outfits.find((outfit) => outfit.id === pendingDeleteId) || null;

  const filterableItems = items.filter((item) => FILTER_CATEGORIES.includes(item.category));
  const filterItem = items.find((item) => item.id === filterItemId);
  const visibleOutfits = filterItemId
    ? outfits.filter((outfit) => outfit.itemIds.includes(filterItemId))
    : outfits;

  useEffect(() => {
    function handleOutsideClick(event) {
      if (filterOpen && filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [filterOpen]);

  useEffect(() => {
    if (!editOutfit || !formAnchorRef.current) {
      return;
    }

    const formAnchor = formAnchorRef.current;
    const headerOffset = 84;
    const top = window.scrollY + formAnchor.getBoundingClientRect().top - headerOffset;

    window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });

    const focusTimer = window.setTimeout(() => {
      const focusTarget = formAnchor.querySelector("input, select, button");
      focusTarget?.focus({ preventScroll: true });
    }, 320);

    return () => {
      window.clearTimeout(focusTimer);
    };
  }, [editOutfit]);

  function addOutfit(form) {
    setOutfits((prev) => [...prev, { ...form, id: generateId() }]);
    setShowForm(false);
  }

  function saveEdit(form) {
    setOutfits((prev) => prev.map((outfit) => (outfit.id === editOutfit.id ? { ...outfit, ...form } : outfit)));
    setEditOutfit(null);
  }

  function deleteOutfit(outfitId) {
    setOutfits((prev) => prev.filter((outfit) => outfit.id !== outfitId));
    if (editOutfit?.id === outfitId) {
      setEditOutfit(null);
    }
  }

  function requestDeleteOutfit(outfitId) {
    setPendingDeleteId(outfitId);
  }

  function confirmDeleteOutfit() {
    if (!pendingDeleteId) {
      return;
    }

    deleteOutfit(pendingDeleteId);
    setPendingDeleteId(null);
  }

  return (
    <div className="outfits-page">
      <div className="page-heading">
        <div>
          <h2 className="page-heading__title">Mis Outfits</h2>
          <p className="page-heading__meta">
            {outfits.length} combinaciones guardadas
          </p>
        </div>

        {!showForm && !editOutfit && (
          <button onClick={() => setShowForm(true)} className="btn btn--primary">
            + Crear outfit
          </button>
        )}
      </div>

      {filterableItems.length > 0 && (
        <div className="outfits-filter" ref={filterRef}>
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
                  setFilterItemId("");
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
                          setFilterItemId(item.id);
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
      )}

      {showForm && (
        <div ref={formAnchorRef} className="page-form-anchor">
          <OutfitForm title="Nuevo outfit" items={items} onSave={addOutfit} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {editOutfit && (
        <div ref={formAnchorRef} className="page-form-anchor">
          <OutfitForm
            title={`Editando: ${editOutfit.name}`}
            initial={{ name: editOutfit.name, itemIds: [...editOutfit.itemIds] }}
            items={items}
            onSave={saveEdit}
            onCancel={() => setEditOutfit(null)}
          />
        </div>
      )}

      {outfits.length === 0 ? (
        <div className="empty-state">Crea tu primer outfit combinando prendas</div>
      ) : visibleOutfits.length === 0 ? (
        <div className="empty-state">No hay outfits que incluyan esa prenda</div>
      ) : (
        <div className="grid-outfits">
          {visibleOutfits.map((outfit) => (
            <OutfitCard
              key={outfit.id}
              outfit={outfit}
              items={items}
              onDelete={requestDeleteOutfit}
              onEdit={(entry) => {
                setEditOutfit(entry);
                setShowForm(false);
              }}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingDeleteOutfit)}
        title="Eliminar outfit"
        message={`Vas a eliminar \"${pendingDeleteOutfit?.name || "este outfit"}\". Esta accion no se puede deshacer.`}
        confirmLabel="Si, eliminar"
        cancelLabel="Volver"
        onConfirm={confirmDeleteOutfit}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  );
}
