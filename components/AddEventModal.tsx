import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Type, User, Briefcase, Users, Music, AlignLeft, Building } from 'lucide-react';
import { EventData, EventType, EventStatus } from '../types';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (event: EventData) => void;
}

export const AddEventModal: React.FC<AddEventModalProps> = ({ isOpen, onClose, onAdd }) => {
  // Helper for local date YYYY-MM-DD
  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    title: '',
    date: getTodayString(),
    startTime: '18:00',
    endTime: '00:00',
    location: '',
    type: EventType.PRIVATE,
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientCompany: '',
    assignedStaff: '',
    equipment: '',
    notes: ''
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Safety: ensure date is present. Browser 'required' handles this usually, but double check to prevent crash.
    if (!formData.date) return;

    const newEvent: EventData = {
      id: `evt-${Date.now()}`,
      title: formData.title,
      date: new Date(formData.date).toISOString(),
      startTime: formData.startTime,
      endTime: formData.endTime,
      location: formData.location,
      type: formData.type as EventType,
      status: EventStatus.INQUIRY,
      client: {
        name: formData.clientName,
        email: formData.clientEmail,
        phone: formData.clientPhone,
        company: formData.clientCompany || undefined
      },
      assignedStaff: formData.assignedStaff ? formData.assignedStaff.split(',').map(s => s.trim()).filter(Boolean) : [],
      equipment: formData.equipment ? formData.equipment.split('\n').map(s => s.trim()).filter(Boolean) : [],
      notes: formData.notes,
      reminders: []
    };
    onAdd(newEvent);
    onClose();
  };

  const InputGroup = ({ label, icon: Icon, children }: any) => (
    <div className="space-y-1.5">
      <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
        <Icon size={12} className="text-fuchsia-500" /> {label}
      </label>
      {children}
    </div>
  );

  const inputClass = "w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-white text-sm focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 outline-none transition-colors placeholder:text-zinc-600";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-4">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <h2 className="text-xl font-bold text-white">Ajouter un événement</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <form id="add-event-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Column: Logistical Details */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white border-b border-zinc-800 pb-2">Détails de l'événement</h3>
              
              <InputGroup label="Titre de l'événement" icon={Type}>
                <input required name="title" value={formData.title} onChange={handleChange} placeholder="Ex: Mariage de Julie & Paul" className={inputClass} />
              </InputGroup>

              <div className="grid grid-cols-2 gap-4">
                <InputGroup label="Type" icon={Type}>
                  <select name="type" value={formData.type} onChange={handleChange} className={inputClass}>
                    {Object.values(EventType).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </InputGroup>
                <InputGroup label="Date" icon={Calendar}>
                  <input required type="date" name="date" value={formData.date} onChange={handleChange} className={inputClass} />
                </InputGroup>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputGroup label="Début" icon={Clock}>
                  <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} className={inputClass} />
                </InputGroup>
                <InputGroup label="Fin" icon={Clock}>
                  <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} className={inputClass} />
                </InputGroup>
              </div>

              <InputGroup label="Lieu / Adresse" icon={MapPin}>
                <input required name="location" value={formData.location} onChange={handleChange} placeholder="Ex: 123 Rue Principale, Montréal" className={inputClass} />
              </InputGroup>
            </div>

            {/* Right Column: Client & Resources */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white border-b border-zinc-800 pb-2">Client & Ressources</h3>

              <div className="grid grid-cols-2 gap-4">
                <InputGroup label="Nom du client" icon={User}>
                  <input required name="clientName" value={formData.clientName} onChange={handleChange} placeholder="Jean Dupont" className={inputClass} />
                </InputGroup>
                <InputGroup label="Entreprise (Optionnel)" icon={Building}>
                  <input name="clientCompany" value={formData.clientCompany} onChange={handleChange} placeholder="Beatek Inc." className={inputClass} />
                </InputGroup>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputGroup label="Email" icon={User}>
                  <input required type="email" name="clientEmail" value={formData.clientEmail} onChange={handleChange} placeholder="jean@example.com" className={inputClass} />
                </InputGroup>
                <InputGroup label="Téléphone" icon={User}>
                  <input required name="clientPhone" value={formData.clientPhone} onChange={handleChange} placeholder="514-555-0000" className={inputClass} />
                </InputGroup>
              </div>

              <InputGroup label="Personnel (séparer par virgule)" icon={Users}>
                <input name="assignedStaff" value={formData.assignedStaff} onChange={handleChange} placeholder="DJ Max, Tech Audio..." className={inputClass} />
              </InputGroup>

              <InputGroup label="Équipement (une ligne par item)" icon={Music}>
                <textarea name="equipment" value={formData.equipment} onChange={handleChange} placeholder="2x Enceintes QSC&#10;1x Micro Shure" className={`${inputClass} h-24 resize-none`} />
              </InputGroup>
            </div>
          </div>

          <div className="mt-8">
            <InputGroup label="Notes & Informations supplémentaires" icon={AlignLeft}>
              <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Détails importants, playlist, contraintes..." className={`${inputClass} h-32`} />
            </InputGroup>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-6 border-t border-zinc-800 flex justify-end gap-3 bg-zinc-900/50 rounded-b-xl">
          <button onClick={onClose} type="button" className="px-6 py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white font-medium transition-colors">
            Annuler
          </button>
          <button type="submit" form="add-event-form" className="px-6 py-2 rounded-lg bg-fuchsia-600 text-white hover:bg-fuchsia-700 font-medium transition-colors shadow-lg shadow-fuchsia-900/20">
            Créer l'événement
          </button>
        </div>
      </div>
    </div>
  );
};
