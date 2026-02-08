import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-md w-full p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-500/10 rounded-full shrink-0">
            <AlertTriangle className="text-red-500" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">{message}</p>
            
            <div className="flex gap-3 justify-end">
              <button 
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white text-sm font-medium transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={() => { onConfirm(); onClose(); }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm font-medium transition-colors shadow-lg shadow-red-900/20"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
