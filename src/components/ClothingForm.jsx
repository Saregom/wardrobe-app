import { useState } from "react";
import { CATEGORIES } from "../constants/appConstants";
import ColorPicker from "./ColorPicker";

export default function ClothingForm({ initial, onSave, onCancel, title }) {
  const [form, setForm] = useState(initial || { name: "", category: "camisas", color: "#2471A3" });

  return (
    <div className="form-card">
      <h3 className="form-card__title">{title}</h3>

      <div className="form-grid">
        <div>
          <label className="form-label">Nombre</label>
          <input
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Ej: Camisa Oxford Azul"
            className="form-control"
          />
        </div>

        <div>
          <label className="form-label">Categoría</label>
          <select
            value={form.category}
            onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
            className="form-control"
          >
            {CATEGORIES.filter((entry) => entry.id !== "all").map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.icon} {entry.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-field form-field--spaced">
        <label className="form-label">Color principal</label>
        <ColorPicker value={form.color} onChange={(color) => setForm((prev) => ({ ...prev, color }))} />
      </div>

      <div className="form-actions">
        <button onClick={() => form.name.trim() && onSave(form)} className="btn btn--primary">
          Guardar
        </button>
        <button onClick={onCancel} className="btn btn--ghost">
          Cancelar
        </button>
      </div>
    </div>
  );
}
