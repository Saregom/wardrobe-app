import { useEffect, useState } from "react";
import { MONTHS, WEEKDAYS } from "../constants/appConstants";
import OutfitCard from "../components/OutfitCard";

export default function CalendarPage({ items, outfits, schedule, setSchedule, notes, setNotes }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [editingNote, setEditingNote] = useState(false);
  const [draftNote, setDraftNote] = useState("");

  useEffect(() => {
    setEditingNote(false);
    setDraftNote(selectedDate ? notes[selectedDate] || "" : "");
  }, [selectedDate, notes]);

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const dateKey = (year, month, day) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const isToday = (day) =>
    day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  const isPastDay = (day) =>
    new Date(viewYear, viewMonth, day) <
    new Date(today.getFullYear(), today.getMonth(), today.getDate());

  function assignOutfit(outfitId) {
    setSchedule((prev) => ({ ...prev, [selectedDate]: outfitId }));
    setShowPicker(false);
  }

  function removeAssignment() {
    setSchedule((prev) => {
      const next = { ...prev };
      delete next[selectedDate];
      return next;
    });
  }

  function saveNote() {
    const trimmed = draftNote.trim();
    setNotes((prev) => {
      const next = { ...prev };
      if (trimmed) {
        next[selectedDate] = trimmed;
      } else {
        delete next[selectedDate];
      }
      return next;
    });
    setEditingNote(false);
  }

  function deleteNote() {
    setNotes((prev) => {
      const next = { ...prev };
      delete next[selectedDate];
      return next;
    });
    setEditingNote(false);
  }

  const cells = [];
  for (let i = 0; i < firstDay; i += 1) {
    cells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(day);
  }

  const selectedOutfitId = selectedDate ? schedule[selectedDate] : null;
  const selectedOutfit = selectedOutfitId ? outfits.find((outfit) => outfit.id === selectedOutfitId) : null;
  const selectedNote = selectedDate ? notes[selectedDate] || "" : "";

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((year) => year - 1);
      return;
    }
    setViewMonth((month) => month - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((year) => year + 1);
      return;
    }
    setViewMonth((month) => month + 1);
  };

  return (
    <div className="calendar-page">
      <h2 className="calendar-page__title">Calendario de Outfits</h2>

      <div className="calendar-nav">
        <button onClick={prevMonth} className="btn btn--ghost btn--icon">
          ‹
        </button>

        <span className="calendar-nav__month">
          {MONTHS[viewMonth]} {viewYear}
        </span>

        <button onClick={nextMonth} className="btn btn--ghost btn--icon">
          ›
        </button>
      </div>

      <div className="calendar-grid">
        <div className="calendar-grid__weekdays">
          {WEEKDAYS.map((weekday) => (
            <div key={weekday} className="calendar-grid__weekday">
              {weekday}
            </div>
          ))}
        </div>

        <div className="calendar-grid__days">
          {cells.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} className="calendar-grid__empty" />;
            }

            const key = dateKey(viewYear, viewMonth, day);
            const assigned = schedule[key] ? outfits.find((outfit) => outfit.id === schedule[key]) : null;
            const dayNote = notes[key] || "";
            const isPast = isPastDay(day);
            const isSelected = selectedDate === key;
            const todayCell = isToday(day);

            return (
              <div
                key={key}
                onClick={() => {
                  setSelectedDate(key);
                  setShowPicker(false);
                }}
                className={`calendar-grid__day ${isSelected ? "is-selected" : ""} ${todayCell ? "is-today" : ""} ${isPast ? "is-past" : ""}`}
              >
                <div className={`calendar-grid__day-number ${todayCell ? "is-today" : ""} ${isPast ? "is-past" : ""}`}>
                  {todayCell ? <span className="calendar-grid__today-pill">{day}</span> : day}
                </div>

                {assigned && (
                  <div className={`calendar-grid__assigned ${isPast ? "is-past" : ""}`}>
                    <span className="calendar-grid__assigned-name">
                      ◈
                      {assigned.name.substring(0, 25)}
                      {assigned.name.length > 20 ? "…" : ""}
                    </span>
                  </div>
                )}

                {dayNote && (
                  <div className={`calendar-grid__note ${isPast ? "is-past" : ""}`}>
                    {dayNote.substring(0, 30)}
                    {dayNote.length > 30 ? "…" : ""}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="calendar-detail">
          <div className="calendar-detail__header">
            <div>
              <div className="calendar-detail__date">
                {new Date(`${selectedDate}T12:00:00`).toLocaleDateString("es-CO", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>

              {isPastDay(parseInt(selectedDate.split("-")[2], 10)) && (
                <span className="calendar-detail__history">HISTORIAL</span>
              )}
            </div>

            <button onClick={() => setSelectedDate(null)} className="calendar-detail__close">
              ✕
            </button>
          </div>

          <div className="calendar-detail__note">
            {editingNote ? (
              <>
                <textarea
                  value={draftNote}
                  onChange={(e) => setDraftNote(e.target.value)}
                  placeholder="Escribe una nota corta para este día..."
                  className="calendar-detail__note-input"
                  rows={2}
                />
                <div className="calendar-detail__note-actions">
                  <button onClick={saveNote} className="btn btn--primary btn--small">
                    Guardar
                  </button>
                  <button onClick={() => setEditingNote(false)} className="btn btn--ghost btn--small">
                    Cancelar
                  </button>
                </div>
              </>
            ) : selectedNote ? (
              <>
                <div className="calendar-detail__note-text">{selectedNote}</div>
                <div className="calendar-detail__note-actions">
                  <button onClick={() => setEditingNote(true)} className="btn btn--ghost btn--small">
                    ✏ Editar
                  </button>
                  <button onClick={deleteNote} className="btn btn--ghost btn--danger-soft btn--small">
                    ✕ Borrar
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => setEditingNote(true)}
                className="calendar-detail__note-add"
              >
                + Agregar nota
              </button>
            )}
          </div>

          {selectedOutfit ? (
            <div>
              <OutfitCard outfit={selectedOutfit} items={items} />
              <div className="calendar-detail__actions">
                <button onClick={() => setShowPicker(!showPicker)} className="btn btn--outline">
                  Cambiar outfit
                </button>
                <button onClick={removeAssignment} className="btn btn--ghost btn--danger-soft">
                  Quitar
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="calendar-detail__empty">Sin outfit asignado para este día</p>
              <button onClick={() => setShowPicker(!showPicker)} className="btn btn--primary">
                + Asignar outfit
              </button>
            </div>
          )}

          {showPicker && (
            <div className="calendar-picker">
              <div className="calendar-picker__title">Selecciona un outfit</div>

              {outfits.length === 0 ? (
                <p className="calendar-picker__empty">Primero crea outfits en Mis Outfits</p>
              ) : (
                <div className="grid-calendar-picker">
                  {outfits.map((outfit) => (
                    <OutfitCard
                      key={outfit.id}
                      outfit={outfit}
                      items={items}
                      selected={selectedOutfitId === outfit.id}
                      onSelect={() => assignOutfit(outfit.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
