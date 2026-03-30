import { useState } from "react";
import { CATEGORIES, generateId } from "../constants/appConstants";
import ClothingCard from "../components/ClothingCard";
import ClothingForm from "../components/ClothingForm";

export default function WardrobePage({ items, setItems }) {
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const filtered = filter === "all" ? items : items.filter((item) => item.category === filter);

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

      {showForm && <ClothingForm title="Nueva prenda" onSave={addItem} onCancel={() => setShowForm(false)} />}

      {editItem && (
        <ClothingForm
          title={`Editando: ${editItem.name}`}
          initial={{ name: editItem.name, category: editItem.category, color: editItem.color }}
          onSave={saveEdit}
          onCancel={() => setEditItem(null)}
        />
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
              onDelete={deleteItem}
              onEdit={(entry) => {
                setEditItem(entry);
                setShowForm(false);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
