import { useEffect, useRef, useState } from "react";
import { CATEGORIES, generateId } from "../constants/appConstants";
import ClothingCard from "../components/ClothingCard";
import ClothingForm from "../components/ClothingForm";
import ConfirmDialog from "../components/ConfirmDialog";

export default function WardrobePage({ items, setItems }) {
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const formAnchorRef = useRef(null);

  const filtered = filter === "all" ? items : items.filter((item) => item.category === filter);
  const pendingDeleteItem = items.find((item) => item.id === pendingDeleteId) || null;

  useEffect(() => {
    if (!editItem || !formAnchorRef.current) {
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
  }, [editItem]);

  function addItem(form) {
    setItems((prev) => [...prev, { ...form, id: generateId() }]);
    setShowForm(false);
  }

  function saveEdit(form) {
    setItems((prev) => prev.map((item) => (item.id === editItem.id ? { ...item, ...form } : item)));
    setEditItem(null);
  }

  function deleteItem(itemId) {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
    if (editItem?.id === itemId) {
      setEditItem(null);
    }
  }

  function requestDeleteItem(itemId) {
    setPendingDeleteId(itemId);
  }

  function confirmDeleteItem() {
    if (!pendingDeleteId) {
      return;
    }

    deleteItem(pendingDeleteId);
    setPendingDeleteId(null);
  }

  return (
    <div className="wardrobe-page">
      <div className="page-heading">
        <div>
          <h2 className="page-heading__title">Mi Armario</h2>
          <p className="page-heading__meta">{items.length} prendas registradas</p>
        </div>

        {!showForm && !editItem && (
          <button onClick={() => setShowForm(true)} className="btn btn--primary">
            + Agregar prenda
          </button>
        )}
      </div>

      {showForm && (
        <div ref={formAnchorRef} className="page-form-anchor">
          <ClothingForm title="Nueva prenda" onSave={addItem} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {editItem && (
        <div ref={formAnchorRef} className="page-form-anchor">
          <ClothingForm
            title={`Editando: ${editItem.name}`}
            initial={{ name: editItem.name, category: editItem.category, color: editItem.color }}
            onSave={saveEdit}
            onCancel={() => setEditItem(null)}
          />
        </div>
      )}

      <div className="filter-pills">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => setFilter(category.id)}
            className={`filter-pills__button ${filter === category.id ? "is-active" : ""}`}
          >
            {category.icon} {category.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">No hay prendas en esta categoría</div>
      ) : (
        <div className="grid-wardrobe">
          {filtered.map((item) => (
            <ClothingCard
              key={item.id}
              item={item}
              onDelete={requestDeleteItem}
              onEdit={(entry) => {
                setEditItem(entry);
                setShowForm(false);
              }}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingDeleteItem)}
        title="Eliminar prenda"
        message={`Vas a eliminar \"${pendingDeleteItem?.name || "esta prenda"}\". Esta accion no se puede deshacer.`}
        confirmLabel="Si, eliminar"
        cancelLabel="Volver"
        onConfirm={confirmDeleteItem}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  );
}
