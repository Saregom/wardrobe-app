import { useEffect } from "react";

export default function ConfirmDialog({
  open,
  title = "Confirmar accion",
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onCancel?.();
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onCancel]);

  if (!open) {
    return null;
  }

  return (
    <div className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title">
      <button
        type="button"
        className="confirm-dialog__backdrop"
        aria-label="Cerrar confirmacion"
        onClick={onCancel}
      />

      <div className="confirm-dialog__panel">
        <h3 id="confirm-dialog-title" className="confirm-dialog__title">
          {title}
        </h3>
        <p className="confirm-dialog__message">{message}</p>

        <div className="confirm-dialog__actions">
          <button type="button" className="btn btn--ghost" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className="btn btn--danger-soft" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
