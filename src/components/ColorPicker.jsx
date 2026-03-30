import { PRESET_COLORS } from "../constants/appConstants";

export default function ColorPicker({ value, onChange }) {
  return (
    <div className="color-picker">
      <div className="color-picker__palette">
        {PRESET_COLORS.map((color) => (
          <div
            key={color}
            onClick={() => onChange(color)}
            className={`color-picker__swatch ${value === color ? "is-selected" : ""}`}
            style={{ background: color }}
          />
        ))}
      </div>

      <div className="color-picker__footer">
        <div className="color-picker__value">
          <div className="color-picker__value-dot" style={{ background: value }} />
          <span className="color-picker__value-code">{value}</span>
        </div>

        <label className="color-picker__custom">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="color-picker__input"
          />
          🎨 Personalizado
        </label>
      </div>
    </div>
  );
}
