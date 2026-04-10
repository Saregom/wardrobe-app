import { useEffect, useRef, useState } from "react";
import { TABS } from "../constants/appConstants";
import CalendarPage from "./CalendarPage";
import OutfitsPage from "./OutfitsPage";
import WardrobePage from "./WardrobePage";

export default function BasePage() {
  const [tab, setTab] = useState("wardrobe");
  const [menuOpen, setMenuOpen] = useState(false);
  const [dataMenuOpen, setDataMenuOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("wardrobe_items") || "[]");
    } catch {
      return [];
    }
  });

  const [outfits, setOutfits] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("wardrobe_outfits") || "[]");
    } catch {
      return [];
    }
  });

  const [schedule, setSchedule] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("wardrobe_schedule") || "{}");
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("wardrobe_items", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("wardrobe_outfits", JSON.stringify(outfits));
  }, [outfits]);

  useEffect(() => {
    localStorage.setItem("wardrobe_schedule", JSON.stringify(schedule));
  }, [schedule]);

  function handleExport() {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      data: { items, outfits, schedule },
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download = `wardrober-backup-${stamp}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setDataMenuOpen(false);
  }

  function handleImportClick() {
    fileInputRef.current?.click();
    setDataMenuOpen(false);
  }

  async function handleImportFile(event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const source = parsed?.data ?? parsed;

      const importedItems = source?.items;
      const importedOutfits = source?.outfits;
      const importedSchedule = source?.schedule;

      const isValid = Array.isArray(importedItems) &&
        Array.isArray(importedOutfits) &&
        importedSchedule &&
        typeof importedSchedule === "object" &&
        !Array.isArray(importedSchedule);

      if (!isValid) {
        window.alert("El archivo no tiene el formato esperado.");
        return;
      }

      const confirmed = window.confirm(
        "Esto reemplazara tus datos actuales (prendas, outfits y calendario). Quieres continuar?"
      );

      if (!confirmed) {
        return;
      }

      setItems(importedItems);
      setOutfits(importedOutfits);
      setSchedule(importedSchedule);
      setTab("wardrobe");
      setMenuOpen(false);
      setDataMenuOpen(false);

      window.alert("Datos importados correctamente.");
    } catch {
      window.alert("No se pudo leer el archivo. Verifica que sea un JSON valido.");
    } finally {
      event.target.value = "";
    }
  }

  return (
    <>
      <header className="app-shell__header">
        <div className="app-shell__header-inner">
          <div className="app-shell__mobile-row">
            <div className="app-shell__brand">
              <span className="app-shell__brand-title">WARDROBER</span>
              {/* <span className="app-shell__brand-subtitle">× Saregom</span> */}
            </div>

            <button
              type="button"
              className={`app-shell__menu-btn ${menuOpen ? "is-open" : ""}`}
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Abrir menu"
              aria-expanded={menuOpen}
              aria-controls="app-main-nav"
            >
              <span />
              <span />
              <span />
            </button>
          </div>

          <nav id="app-main-nav" className={`app-shell__nav ${menuOpen ? "is-open" : ""}`}>
            {TABS.map((entry) => (
              <button
                key={entry.id}
                onClick={() => {
                  setTab(entry.id);
                  setMenuOpen(false);
                  setDataMenuOpen(false);
                }}
                className={`app-shell__tab app-shell__tab--primary ${tab === entry.id ? "is-active" : ""}`}
              >
                {entry.icon} {entry.label}
              </button>
            ))}

            <div className={`app-shell__data-menu ${dataMenuOpen ? "is-open" : ""}`}>
              <button
                type="button"
                className={`app-shell__tab app-shell__data-tab ${dataMenuOpen ? "is-active" : ""}`}
                onClick={() => setDataMenuOpen((prev) => !prev)}
                aria-expanded={dataMenuOpen}
                aria-controls="app-data-dropdown"
              >
                ⚙ Datos <span className="app-shell__data-caret">▾</span>
              </button>

              <div id="app-data-dropdown" className="app-shell__data-dropdown">
                <button type="button" className="app-shell__data-option" onClick={handleExport}>
                  Exportar
                </button>
                <button type="button" className="app-shell__data-option" onClick={handleImportClick}>
                  Importar
                </button>
              </div>
            </div>
          </nav>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleImportFile}
            className="app-shell__file-input"
          />
        </div>
      </header>

      <main className="app-shell__main">
        {tab === "wardrobe" && <WardrobePage items={items} setItems={setItems} />}
        {tab === "outfits" && <OutfitsPage items={items} outfits={outfits} setOutfits={setOutfits} />}
        {tab === "calendar" && (
          <CalendarPage items={items} outfits={outfits} schedule={schedule} setSchedule={setSchedule} />
        )}
      </main>

      <nav className="app-shell__mobile-bottom-nav" aria-label="Navegacion principal">
        {TABS.map((entry) => (
          <button
            key={`mobile-${entry.id}`}
            type="button"
            onClick={() => {
              setTab(entry.id);
              setMenuOpen(false);
              setDataMenuOpen(false);
            }}
            className={`app-shell__mobile-tab ${tab === entry.id ? "is-active" : ""}`}
          >
            <span className="app-shell__mobile-tab-icon" aria-hidden="true">
              {entry.icon}
            </span>
            <span className="app-shell__mobile-tab-label">{entry.label}</span>
          </button>
        ))}
      </nav>

      {/* <footer className="app-shell__footer">
        <span className="app-shell__footer-text">VESTIDOR ATELIER - TU GUARDARROPA DIGITAL</span>
      </footer> */}
    </>
  );
}
