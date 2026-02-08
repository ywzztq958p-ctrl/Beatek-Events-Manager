import React, { useState } from 'react';
import { EventData, EventStatus } from '../types';
import { ChevronRight, Calendar, User, Trash2, Search, MapPin } from 'lucide-react';
import { ConfirmationModal } from './ConfirmationModal';

interface EventListProps {
  events: EventData[];
  onSelectEvent: (event: EventData) => void;
  onDeleteEvent: (id: string) => void;
}

export const EventList: React.FC<EventListProps> = ({ events, onSelectEvent, onDeleteEvent }) => {
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusColor = (status: EventStatus) => {
    switch (status) {
      case EventStatus.CONFIRMED: return 'text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-500/10';
      case EventStatus.SIGNED: return 'text-green-400 border-green-500/30 bg-green-500/10';
      case EventStatus.INQUIRY: return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
      default: return 'text-zinc-400 border-zinc-700 bg-zinc-800';
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent opening detail view
    setEventToDelete(id);
  };

  const confirmDelete = () => {
    if (eventToDelete) {
      onDeleteEvent(eventToDelete);
      setEventToDelete(null);
    }
  };

  const filteredEvents = events.filter(evt => {
    const query = searchQuery.toLowerCase();
    return (
      evt.title.toLowerCase().includes(query) ||
      evt.client.name.toLowerCase().includes(query) ||
      (evt.client.company && evt.client.company.toLowerCase().includes(query)) ||
      evt.location.toLowerCase().includes(query)
    );
  });

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-white">Événements à venir</h2>
          
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher (titre, client, lieu)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-white pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all placeholder:text-zinc-600 text-sm"
            />
          </div>
        </div>
        
        <div className="grid gap-3">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((evt) => (
              <div 
                key={evt.id}
                onClick={() => onSelectEvent(evt)}
                className="group bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 p-4 rounded-xl cursor-pointer transition-all flex items-center justify-between animate-in fade-in slide-in-from-bottom-2 duration-300"
              >
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="flex flex-col items-center justify-center bg-zinc-950 w-14 h-14 rounded-lg border border-zinc-800 shrink-0">
                    <span className="text-xs text-zinc-500 uppercase">{new Date(evt.date).toLocaleDateString('fr-CA', { month: 'short' })}</span>
                    <span className="text-xl font-bold text-white">{new Date(evt.date).getDate()}</span>
                  </div>
                  
                  <div className="min-w-0">
                    <h3 className="font-semibold text-white group-hover:text-fuchsia-400 transition-colors truncate">{evt.title}</h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-500 mt-1">
                      <span className="flex items-center gap-1 shrink-0"><Calendar size={12} /> {evt.type}</span>
                      <span className="flex items-center gap-1 shrink-0"><User size={12} /> {evt.client.name}</span>
                      <span className="flex items-center gap-1 shrink-0 truncate"><MapPin size={12} /> {evt.location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 pl-2">
                  <span className={`hidden sm:inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border whitespace-nowrap ${getStatusColor(evt.status)}`}>
                    {evt.status}
                  </span>
                  
                  <div className="flex items-center gap-2">
                     <button 
                        onClick={(e) => handleDeleteClick(e, evt.id)}
                        className="p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                        title="Supprimer"
                     >
                        <Trash2 size={16} />
                     </button>
                     <ChevronRight className="text-zinc-600 group-hover:text-white" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-zinc-900/50 rounded-xl border border-dashed border-zinc-800">
              <Search className="mx-auto text-zinc-700 mb-3" size={32} />
              <p className="text-zinc-500 font-medium">Aucun résultat trouvé pour "{searchQuery}"</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-2 text-fuchsia-500 hover:text-fuchsia-400 text-sm hover:underline"
              >
                Effacer la recherche
              </button>
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal 
        isOpen={!!eventToDelete}
        onClose={() => setEventToDelete(null)}
        onConfirm={confirmDelete}
        title="Supprimer l'événement ?"
        message="Cette action est irréversible. L'événement ainsi que toutes les données associées (contrats, signatures) seront supprimés définitivement."
      />
    </>
  );
};