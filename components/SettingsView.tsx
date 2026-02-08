import React, { useState } from 'react';
import { Save, User, Building, Mail, Globe, Bell } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [formData, setFormData] = useState({
    companyName: 'Beatek Events',
    adminName: 'Admin',
    email: 'admin@beatek.com',
    website: 'www.beatek-events.com',
    currency: 'CAD ($)',
    notifications: true
  });
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const InputGroup = ({ label, icon: Icon, children }: any) => (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
        <Icon size={14} className="text-fuchsia-500" /> {label}
      </label>
      {children}
    </div>
  );

  const inputClass = "w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white text-sm focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 outline-none transition-colors placeholder:text-zinc-600";

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Paramètres de l'entreprise</h2>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 space-y-6">
          <h3 className="text-lg font-semibold text-white border-b border-zinc-800 pb-4">Informations Générales</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputGroup label="Nom de l'entreprise" icon={Building}>
              <input name="companyName" value={formData.companyName} onChange={handleChange} className={inputClass} />
            </InputGroup>

            <InputGroup label="Nom de l'administrateur" icon={User}>
              <input name="adminName" value={formData.adminName} onChange={handleChange} className={inputClass} />
            </InputGroup>

            <InputGroup label="Email de contact" icon={Mail}>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} />
            </InputGroup>

             <InputGroup label="Site Web" icon={Globe}>
              <input name="website" value={formData.website} onChange={handleChange} className={inputClass} />
            </InputGroup>
          </div>
        </div>

        <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 space-y-6">
          <h3 className="text-lg font-semibold text-white border-b border-zinc-800 pb-4">Préférences</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputGroup label="Devise" icon={Building}>
              <select name="currency" value={formData.currency} onChange={handleChange} className={inputClass}>
                <option>CAD ($)</option>
                <option>USD ($)</option>
                <option>EUR (€)</option>
              </select>
            </InputGroup>

            <div className="flex items-center justify-between bg-zinc-900 p-4 rounded-lg border border-zinc-800">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-zinc-800 rounded-lg text-fuchsia-500">
                   <Bell size={20} />
                 </div>
                 <div>
                   <p className="text-white font-medium">Notifications</p>
                   <p className="text-xs text-zinc-500">Recevoir des alertes par email</p>
                 </div>
               </div>
               <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={formData.notifications} onChange={() => setFormData(prev => ({...prev, notifications: !prev.notifications}))} className="sr-only peer" />
                  <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fuchsia-600"></div>
                </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            className={`flex items-center gap-2 px-8 py-3 rounded-lg font-bold text-white transition-all transform active:scale-95 ${isSaved ? 'bg-green-600 hover:bg-green-700' : 'bg-fuchsia-600 hover:bg-fuchsia-700 shadow-lg shadow-fuchsia-900/20'}`}
          >
            {isSaved ? 'Sauvegardé !' : <><Save size={18} /> Enregistrer les modifications</>}
          </button>
        </div>
      </form>
    </div>
  );
};
