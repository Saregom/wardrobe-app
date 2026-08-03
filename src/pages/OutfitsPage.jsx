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
  const formAnchorRef = useRef(null);
  const pendingDeleteOutfit = outfits.find((outfit) => outfit.id === pendingDeleteId) || null;

  const filterableItems = items.filter((item) => FILTER_CATEGORIES.includes(item.category));
  const visibleOutfits = filterItemId
    ? outfits.filter((outfit) => outfit.itemIds.includes(filterItemId))
    : outfits;

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
        <div className="outfits-filter">
          <label className="form-label" htmlFor="outfit-filter">
            Filtrar por prenda
          </label>
          <select
            id="outfit-filter"
            className="form-control"
            value={filterItemId}
            onChange={(e) => setFilterItemId(e.target.value)}
          >
            <option value="">Todas las prendas</option>
            {FILTER_CATEGORIES.map((categoryId) => {
              const category = CATEGORIES.find((entry) => entry.id === categoryId);
              const categoryItems = filterableItems.filter((item) => item.category === categoryId);
              if (categoryItems.length === 0) {
                return null;
              }
              return (
                <optgroup key={categoryId} label={`${category.icon} ${category.label}`}>
                  {categoryItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </optgroup>
              );
            })}
          </select>
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
