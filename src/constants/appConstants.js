export const CATEGORIES = [
  { id: "all", label: "Todo", icon: "◈" },
  { id: "camisas", label: "Camisas", icon: "👔" },
  { id: "pantalones", label: "Pantalones", icon: "👖" },
  { id: "sacos", label: "Sacos", icon: "🥼" },
  { id: "chaquetas", label: "Chaquetas", icon: "🧥" },
  { id: "interiores", label: "Medias / Interior", icon: "🧦" },
  { id: "zapatos", label: "Zapatos", icon: "👟" },
];

export const PRESET_COLORS = [
  "#1C1C1C",
  "#4A4A4A",
  "#8C8C8C",
  "#FFFFFF",
  "#8B1A1A",
  "#C0392B",
  "#E74C3C",
  "#F1948A",
  "#1A3A5C",
  "#2471A3",
  "#5DADE2",
  "#AED6F1",
  "#1D4D2E",
  "#27AE60",
  "#82E0AA",
  "#D5F5E3",
  "#4A235A",
  "#8E44AD",
  "#C39BD3",
  "#F5EEF8",
  "#784212",
  "#D35400",
  "#F0B27A",
  "#FAD7A0",
  "#7D6608",
  "#F4D03F",
  "#F9E79F",
  "#FEF9E7",
];

export const WEEKDAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export const TABS = [
  { id: "wardrobe", label: "Armario", icon: "◈" },
  { id: "outfits", label: "Outfits", icon: "✦" },
  { id: "calendar", label: "Calendario", icon: "◷" },
];

export const generateId = () => {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
};
