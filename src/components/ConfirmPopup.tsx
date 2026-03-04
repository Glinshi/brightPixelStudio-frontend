import { X } from "lucide-react";
import Button from "./Button";

interface ConfirmPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

export default function ConfirmPopup({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
}: ConfirmPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {title}
          </h2>
          <p className="text-gray-600 mb-6">{message}</p>

          <div className="flex gap-3 justify-center">
            <Button
              variant="secondary"
              onClick={onClose}
              className="px-6 py-3"
            >
              {cancelText}
            </Button>
            <Button
              variant="primary"
              onClick={onConfirm}
              disabled={loading}
              className="px-6 py-3"
            >
              {loading ? "Deleting..." : confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
