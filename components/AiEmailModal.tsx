import React, { useState } from 'react';
import { X, Mail, Copy, Send } from 'lucide-react';

interface AiEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: () => void;
  recipient: string;
  subject: string;
  body: string;
}

export const AiEmailModal: React.FC<AiEmailModalProps> = ({ isOpen, onClose, onSend, recipient, subject, body }) => {
  const [copyButtonText, setCopyButtonText] = useState('Copier le texte');

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(body);
    setCopyButtonText('Copié !');
    setTimeout(() => setCopyButtonText('Copier le texte'), 2000);
  };
  
  const handleConfirmSend = () => {
    onSend();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-4">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <Mail size={20} className="text-fuchsia-500" />
            <h2 className="text-xl font-bold text-white">Envoyer le contrat au client</h2>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          <div className="flex gap-2 items-center">
            <span className="text-sm font-medium text-zinc-500 w-20 text-right">À :</span>
            <input 
              type="text" 
              readOnly 
              value={recipient} 
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-300" 
            />
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-sm font-medium text-zinc-500 w-20 text-right">Sujet :</span>
            <input 
              type="text" 
              readOnly 
              value={subject} 
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-white font-medium" 
            />
          </div>
          <textarea
            readOnly
            value={body}
            className="w-full h-64 bg-zinc-950 border border-zinc-800 rounded p-4 text-zinc-300 text-sm leading-relaxed resize-none custom-scrollbar"
          />
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-zinc-800 flex justify-between items-center bg-zinc-900/50 rounded-b-xl">
          <button onClick={handleCopy} type="button" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white font-medium text-sm transition-colors">
            <Copy size={14} /> {copyButtonText}
          </button>
          <div className="flex gap-3">
             <button onClick={onClose} type="button" className="px-6 py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white font-medium transition-colors">
              Annuler
            </button>
            <button onClick={handleConfirmSend} className="flex items-center gap-2 px-6 py-2 rounded-lg bg-fuchsia-600 text-white hover:bg-fuchsia-700 font-medium transition-colors shadow-lg shadow-fuchsia-900/20">
              <Send size={14} /> Marquer comme envoyé
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
