import { useState } from "react";
import ClothingCard from "./ClothingCard";

export default function OutfitForm({ initial, items, onSave, onCancel, title }) {
  const [form, setForm] = useState(initial || { name: "", itemIds: [] });
  const [showErrors, setShowErrors] = useState(false);

  const nameError = showErrors && !form.name.trim();
  const itemsError = showErrors && form.itemIds.length === 0;

  function handleSave() {
    setShowErrors(true);
    if (!form.name.trim() || form.itemIds.length === 0) {
      return;
    }
    onSave(form);
  }

  function toggleItem(itemId) {
    setForm((prev) => ({
      ...prev,
      itemIds: prev.itemIds.includes(itemId)
        ? prev.itemIds.filter((id) => id !== itemId)
        : [...prev.itemIds, itemId],
    }));
  }

  return (
    <div className="form-card">
      <h3 className="form-card__title">{title}</h3>

      <div className="form-field">
        <label className="form-label">Nombre del outfit</label>
        <input
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="Ej: Look casual viernes"
          className={`form-control ${nameError ? "is-error" : ""}`}
          aria-invalid={nameError}
        />
        {nameError && <p className="form-error">El nombre del outfit es obligatorio.</p>}
      </div>

      <div className="form-field form-field--spaced">
        <label className="form-label">Prendas ({form.itemIds.length} seleccionadas)</label>
        {items.length === 0 ? (
          <p className="page-heading__meta">Primero agrega prendas en Mi Armario</p>
        ) : (
          <div className="grid-outfit-picker">
            {items.map((item) => (
              <ClothingCard
                key={item.id}
                item={item}
                selected={form.itemIds.includes(item.id)}
                onSelect={() => toggleItem(item.id)}
              />
            ))}
          </div>
        )}
        {items.length > 0 && itemsError && <p className="form-error">Selecciona al menos una prenda.</p>}
      </div>

      <div className="form-actions">
        <button onClick={handleSave} className="btn btn--primary">
          Guardar outfit
        </button>
        <button onClick={onCancel} className="btn btn--ghost">
          Cancelar
        </button>
      </div>
    </div>
  );
}
