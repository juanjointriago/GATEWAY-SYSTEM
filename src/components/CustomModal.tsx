import React, { useState } from 'react';

export interface CustomModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'warn' | 'info' | 'danger' | 'success';
  onConfirm: () => Promise<void> | void;
  onCancel?: () => void;
}

const typeStyles = {
  warn: {
    bg: 'bg-yellow-100',
    border: 'border-yellow-400',
    text: 'text-yellow-700',
    icon: '⚠️'
  },
  info: {
    bg: 'bg-blue-100',
    border: 'border-blue-400',
    text: 'text-blue-700',
    icon: 'ℹ️'
  },
  danger: {
    bg: 'bg-red-100',
    border: 'border-red-400',
    text: 'text-red-700',
    icon: '❌'
  },
  success: {
    bg: 'bg-green-100',
    border: 'border-green-400',
    text: 'text-green-700',
    icon: '✅'
  }
};

const CustomModal: React.FC<CustomModalProps> = ({ isOpen, title, message, type, onConfirm, onCancel }) => {
  const [loading, setLoading] = useState(false);
  if (!isOpen) return null;

  const styles = typeStyles[type];

  const handleConfirm = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className={`max-w-lg w-full mx-4 p-6 rounded-lg border ${styles.border} ${styles.bg} shadow-lg`} role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="modal-description">
        <div className="flex items-center mb-4">
          <span className={`text-3xl mr-3 ${styles.text}`}>{styles.icon}</span>
          <h2 id="modal-title" className={`text-xl font-semibold ${styles.text}`}>{title}</h2>
        </div>
        <p id="modal-description" className={`mb-6 ${styles.text}`}>{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded font-semibold text-white bg-${type === 'danger' ? 'red' : type === 'warn' ? 'yellow' : type === 'info' ? 'blue' : 'green'}-600 hover:bg-${type === 'danger' ? 'red' : type === 'warn' ? 'yellow' : type === 'info' ? 'blue' : 'green'}-700 transition-colors ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Procesando...' : 'Confirmar'}
          </button>
          {onCancel && (
            <button
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 rounded font-semibold border border-gray-300 hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
