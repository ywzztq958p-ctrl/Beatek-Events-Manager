import React, { useState } from 'react';
import { EventData, EventStatus, Reminder } from '../types';
import { Calendar, MapPin, User, Clock, Music, FileText, Send, CheckCircle, AlertCircle, Wand2, X, Trash2, Bell, Plus } from 'lucide-react';
import { SignaturePad } from './SignaturePad';
import { generateContractClause } from '../services/aiService';
import { ConfirmationModal } from './ConfirmationModal';

interface EventDetailProps {
  event: EventData;
  onBack: () => void;
  onUpdate: (updatedEvent: EventData) => void;
  onDelete: (id: string) => void;
}

export const EventDetail: React.FC<EventDetailProps> = ({ event, onBack, onUpdate, onDelete }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'contract'>('info');
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [notification, setNotification] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('fr-CA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSign = (signatureData: string) => {
    const updatedEvent = {
      ...event,
      status: EventStatus.SIGNED,
      contract: {
        ...event.contract!,
        isSignedClient: true,
        clientSignature: signatureData
      }
    };
    onUpdate(updatedEvent);
    setShowSignaturePad(false);
    showNotification("Contrat signé avec succès !");
  };

  const handleSendContract = () => {
    const updatedEvent = {
      ...event,
      status: EventStatus.CONTRACT_SENT
    };
    onUpdate(updatedEvent);
    showNotification(`Contrat envoyé à ${event.client.email}`);
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAiAssist = async () => {
    if (!aiPrompt.trim()) return;
    setIsGeneratingAi(true);
    const clause = await generateContractClause(aiPrompt);
    
    // Add clause to event contract
    const currentClauses = event.contract?.specialClauses || [];
    const updatedEvent = {
      ...event,
      contract: {
        ...event.contract!,
        specialClauses: [...currentClauses, clause]
      }
    };
    
    onUpdate(updatedEvent);
    setIsGeneratingAi(false);
    setAiPrompt('');
  };

  const handleDelete = () => {
    onDelete(event.id);
  };

  const addReminder = (offsetMinutes: number, label: string) => {
    const newReminder: Reminder = {
      id: `rem-${Date.now()}`,
      label,
      offsetMinutes,
      isDismissed: false
    };
    const updatedEvent = {
      ...event,
      reminders: [...(event.reminders || []), newReminder]
    };
    onUpdate(updatedEvent);
    showNotification("Rappel ajouté");
  };

  const removeReminder = (reminderId: string) => {
    const updatedEvent = {
      ...event,
      reminders: event.reminders.filter(r => r.id !== reminderId)
    };
    onUpdate(updatedEvent);
  };

  return (
    <div className="h-full flex flex-col animate-in slide-in-from-right-10 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-zinc-400 hover:text-white flex items-center gap-2 transition-colors">
          ← Retour
        </button>
        <div className="flex items-center gap-3">
            <button 
                onClick={() => setIsDeleteModalOpen(true)}
                className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                title="Supprimer l'événement"
            >
                <Trash2 size={18} />
            </button>
            <div className="h-6 w-px bg-zinc-800"></div>
            {event.status === EventStatus.SIGNED && (
                <span className="bg-fuchsia-500/10 text-fuchsia-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-fuchsia-500/20 flex items-center gap-2">
                    <CheckCircle size={12} /> Signé
                </span>
            )}
             <span className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-zinc-700">
                {event.status}
             </span>
        </div>
      </div>

      {notification && (
        <div className="fixed top-6 right-6 bg-fuchsia-600 text-white px-6 py-3 rounded-lg shadow-lg shadow-fuchsia-900/50 z-50 animate-in fade-in slide-in-from-top-4 flex items-center gap-3">
          <CheckCircle size={20} />
          {notification}
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col md:flex-row gap-6">
        
        {/* Sidebar Info */}
        <div className="md:w-1/3 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{event.title}</h1>
            <div className="flex items-center text-zinc-400 gap-2">
              <Calendar size={16} className="text-fuchsia-500" />
              {formatDate(event.date)}
            </div>
          </div>

          <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 space-y-4">
            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Détails Logistiques</h3>
            
            <div className="flex items-start gap-3">
              <Clock className="text-zinc-500 mt-1" size={18} />
              <div>
                <p className="text-white">{event.startTime} - {event.endTime}</p>
                <p className="text-zinc-500 text-sm">Horaire événement</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="text-zinc-500 mt-1" size={18} />
              <div>
                <p className="text-white">{event.location}</p>
                <p className="text-zinc-500 text-sm">Adresse</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="text-zinc-500 mt-1" size={18} />
              <div>
                <p className="text-white">{event.client.name}</p>
                <p className="text-zinc-400 text-sm">{event.client.email}</p>
                <p className="text-zinc-400 text-sm">{event.client.phone}</p>
                {event.client.company && <p className="text-fuchsia-400 text-xs mt-1">{event.client.company}</p>}
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 space-y-4">
             <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                   <Bell size={14} className="text-fuchsia-500" /> Rappels
                </h3>
             </div>
             
             <div className="space-y-2">
               {(!event.reminders || event.reminders.length === 0) && (
                 <p className="text-sm text-zinc-500 italic">Aucun rappel configuré</p>
               )}
               {event.reminders?.map(rem => (
                 <div key={rem.id} className="flex items-center justify-between bg-zinc-800/50 p-2 rounded border border-zinc-700/50">
                    <div className="flex items-center gap-2">
                      <Clock size={12} className="text-zinc-400" />
                      <span className="text-sm text-zinc-200">{rem.label}</span>
                    </div>
                    <button onClick={() => removeReminder(rem.id)} className="text-zinc-500 hover:text-red-400">
                      <X size={14} />
                    </button>
                 </div>
               ))}
             </div>

             <div className="grid grid-cols-2 gap-2 pt-2">
                <button 
                  onClick={() => addReminder(1440, "24h avant")}
                  className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 rounded border border-zinc-700 transition-colors flex items-center justify-center gap-1"
                >
                  <Plus size={12} /> 24h
                </button>
                <button 
                  onClick={() => addReminder(10080, "1 semaine avant")}
                  className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 rounded border border-zinc-700 transition-colors flex items-center justify-center gap-1"
                >
                  <Plus size={12} /> 1 semaine
                </button>
             </div>
          </div>

          <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 space-y-4">
             <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Équipe & Matériel</h3>
             <div className="space-y-2">
                <div className="flex gap-2 flex-wrap">
                    {event.assignedStaff.map(staff => (
                        <span key={staff} className="bg-zinc-800 text-zinc-300 text-xs px-2 py-1 rounded border border-zinc-700">{staff}</span>
                    ))}
                    {event.assignedStaff.length === 0 && <span className="text-zinc-500 text-sm italic">Aucun personnel assigné</span>}
                </div>
             </div>
             <div className="space-y-2">
                <div className="flex gap-2 items-center text-zinc-400 text-sm">
                    <Music size={14} /> Équipement prévu :
                </div>
                <ul className="list-disc list-inside text-sm text-zinc-300 ml-1">
                    {event.equipment.map(eq => (
                        <li key={eq}>{eq}</li>
                    ))}
                    {event.equipment.length === 0 && <li className="text-zinc-500 italic list-none">Aucun équipement listé</li>}
                </ul>
             </div>
          </div>
        </div>

        {/* Main Tabs */}
        <div className="md:w-2/3 bg-zinc-900 rounded-xl border border-zinc-800 flex flex-col overflow-hidden">
          <div className="flex border-b border-zinc-800">
            <button 
              onClick={() => setActiveTab('info')}
              className={`flex-1 py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'info' ? 'border-fuchsia-500 text-white bg-zinc-800/50' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
            >
              Notes & Déroulement
            </button>
            <button 
              onClick={() => setActiveTab('contract')}
              className={`flex-1 py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'contract' ? 'border-fuchsia-500 text-white bg-zinc-800/50' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
            >
              Contrat & Signature
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {activeTab === 'info' && (
              <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Notes Générales</h3>
                    <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{event.notes || <span className="italic text-zinc-600">Aucune note pour le moment.</span>}</p>
                </div>
                {/* Could add timeline here later */}
              </div>
            )}

            {activeTab === 'contract' && (
              <div className="space-y-6">
                {!event.contract ? (
                    <div className="text-center py-10">
                        <FileText size={48} className="mx-auto text-zinc-700 mb-4" />
                        <h3 className="text-xl font-bold text-white">Aucun contrat généré</h3>
                        <p className="text-zinc-500 mb-6">Générez un contrat pour commencer le processus.</p>
                        <button 
                            onClick={() => {
                                onUpdate({
                                    ...event,
                                    contract: {
                                        generatedDate: new Date().toISOString(),
                                        amount: 0,
                                        deposit: 0,
                                        isSignedClient: false,
                                        isSignedBeatek: true
                                    }
                                });
                            }}
                            className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            Créer le contrat
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800">
                                <label className="text-xs text-zinc-500 uppercase">Montant Total</label>
                                <div className="text-2xl font-bold text-white">${event.contract.amount}</div>
                            </div>
                            <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800">
                                <label className="text-xs text-zinc-500 uppercase">Dépôt Requis</label>
                                <div className="text-2xl font-bold text-zinc-300">${event.contract.deposit}</div>
                            </div>
                        </div>

                        {/* AI Assistant Section */}
                        <div className="bg-zinc-800/30 border border-fuchsia-500/20 p-4 rounded-lg">
                            <h4 className="flex items-center gap-2 text-fuchsia-400 font-semibold mb-3">
                                <Wand2 size={16} /> Assistant IA
                            </h4>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                    placeholder="Ex: Ajouter une clause pour pluie extérieure..."
                                    className="flex-1 bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:border-fuchsia-500 outline-none"
                                />
                                <button 
                                    onClick={handleAiAssist}
                                    disabled={isGeneratingAi}
                                    className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded text-sm transition-colors disabled:opacity-50"
                                >
                                    {isGeneratingAi ? '...' : 'Générer'}
                                </button>
                            </div>
                        </div>

                        {/* Clauses List */}
                        {event.contract.specialClauses && event.contract.specialClauses.length > 0 && (
                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-zinc-400">Clauses Spéciales</h4>
                                {event.contract.specialClauses.map((clause, idx) => (
                                    <div key={idx} className="bg-zinc-950 p-3 rounded border border-zinc-800 text-sm text-zinc-300 flex justify-between group">
                                        <p>{clause}</p>
                                        <button 
                                            onClick={() => {
                                                const newClauses = event.contract!.specialClauses!.filter((_, i) => i !== idx);
                                                onUpdate({...event, contract: {...event.contract!, specialClauses: newClauses}});
                                            }}
                                            className="text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col gap-3 mt-6">
                            {event.contract.isSignedClient ? (
                                <div className="bg-green-900/20 border border-green-500/30 p-4 rounded-lg flex items-center gap-4">
                                    <CheckCircle className="text-green-500" size={24} />
                                    <div>
                                        <p className="text-green-400 font-medium">Contrat Signé</p>
                                        <p className="text-green-500/60 text-sm">Le {new Date().toLocaleDateString()}</p>
                                    </div>
                                    {event.contract.clientSignature && (
                                        <img src={event.contract.clientSignature} alt="Signature" className="h-8 ml-auto bg-white/10 rounded px-2" />
                                    )}
                                </div>
                            ) : (
                                <>
                                    {showSignaturePad ? (
                                        <div className="bg-black/50 p-4 rounded-xl border border-zinc-800">
                                            <SignaturePad onSave={handleSign} onCancel={() => setShowSignaturePad(false)} />
                                        </div>
                                    ) : (
                                        <div className="flex gap-3">
                                            <button 
                                                onClick={() => setShowSignaturePad(true)}
                                                className="flex-1 bg-fuchsia-600 hover:bg-fuchsia-700 text-white py-3 rounded-lg font-medium flex justify-center items-center gap-2 transition-colors"
                                            >
                                                <FileText size={18} /> Signer maintenant
                                            </button>
                                            <button 
                                                onClick={handleSendContract}
                                                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-lg font-medium flex justify-center items-center gap-2 transition-colors"
                                            >
                                                <Send size={18} /> Envoyer au client
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Supprimer l'événement ?"
        message="Voulez-vous vraiment supprimer cet événement ? Toutes les données associées seront perdues."
      />
    </div>
  );
};
