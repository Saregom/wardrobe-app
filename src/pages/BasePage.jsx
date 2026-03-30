import { useEffect, useState } from "react";
import { TABS } from "../constants/appConstants";
import CalendarPage from "./CalendarPage";
import OutfitsPage from "./OutfitsPage";
import WardrobePage from "./WardrobePage";

export default function BasePage() {
  const [tab, setTab] = useState("wardrobe");
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

  return (
    <>
      <header className="app-shell__header">
        <div className="app-shell__header-inner">
          <div className="app-shell__brand">
            <span className="app-shell__brand-title">WARDROBER</span>
            {/* <span className="app-shell__brand-subtitle">× Saregom</span> */}
          </div>

          <nav className="app-shell__nav">
            {TABS.map((entry) => (
              <button
                key={entry.id}
                onClick={() => setTab(entry.id)}
                className={`app-shell__tab ${tab === entry.id ? "is-active" : ""}`}
              >
                {entry.icon} {entry.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="app-shell__main">
        {tab === "wardrobe" && <WardrobePage items={items} setItems={setItems} />}
        {tab === "outfits" && <OutfitsPage items={items} outfits={outfits} setOutfits={setOutfits} />}
        {tab === "calendar" && (
          <CalendarPage items={items} outfits={outfits} schedule={schedule} setSchedule={setSchedule} />
        )}
      </main>

      {/* <footer className="app-shell__footer">
        <span className="app-shell__footer-text">VESTIDOR ATELIER - TU GUARDARROPA DIGITAL</span>
      </footer> */}
    </>
  );
}
