import { X, AlertTriangle } from "lucide-react";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: "danger" | "warning" | "info";
}

export default function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  variant = "danger",
}: ConfirmationDialogProps) {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          icon: "text-red-600",
          confirmButton: "bg-red-600 hover:bg-red-700 text-white",
          iconBg: "bg-red-100",
        };
      case "warning":
        return {
          icon: "text-yellow-600",
          confirmButton: "bg-yellow-600 hover:bg-yellow-700 text-white",
          iconBg: "bg-yellow-100",
        };
      case "info":
        return {
          icon: "text-blue-600",
          confirmButton: "bg-blue-600 hover:bg-blue-700 text-white",
          iconBg: "bg-blue-100",
        };
      default:
        return {
          icon: "text-red-600",
          confirmButton: "bg-red-600 hover:bg-red-700 text-white",
          iconBg: "bg-red-100",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-start">
          <div className={`flex-shrink-0 ${styles.iconBg} rounded-full p-2`}>
            <AlertTriangle className={`h-6 w-6 ${styles.icon}`} />
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              {title}
            </h3>
            <p className="text-sm text-secondary-600 mb-6">
              {message}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 text-secondary-600 hover:text-secondary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${styles.confirmButton}`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  confirmText
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}











