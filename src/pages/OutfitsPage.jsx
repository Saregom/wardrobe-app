import { useState } from "react";
import { generateId } from "../constants/appConstants";
import OutfitCard from "../components/OutfitCard";
import OutfitForm from "../components/OutfitForm";

export default function OutfitsPage({ items, outfits, setOutfits }) {
  const [showForm, setShowForm] = useState(false);
  const [editOutfit, setEditOutfit] = useState(null);

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

      {showForm && <OutfitForm title="Nuevo outfit" items={items} onSave={addOutfit} onCancel={() => setShowForm(false)} />}

      {editOutfit && (
        <OutfitForm
          title={`Editando: ${editOutfit.name}`}
          initial={{ name: editOutfit.name, itemIds: [...editOutfit.itemIds] }}
          items={items}
          onSave={saveEdit}
          onCancel={() => setEditOutfit(null)}
        />
      )}

      {outfits.length === 0 ? (
        <div className="empty-state">Crea tu primer outfit combinando prendas</div>
      ) : (
        <div className="grid-outfits">
          {outfits.map((outfit) => (
            <OutfitCard
              key={outfit.id}
              outfit={outfit}
              items={items}
              onDelete={deleteOutfit}
              onEdit={(entry) => {
                setEditOutfit(entry);
                setShowForm(false);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
