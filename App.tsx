import React, { useState, useEffect } from 'react';
import { Logo } from './components/Logo';
import { Dashboard } from './components/Dashboard';
import { EventList } from './components/EventList';
import { CalendarView } from './components/CalendarView';
import { EventDetail } from './components/EventDetail';
import { AddEventModal } from './components/AddEventModal';
import { LoginScreen } from './components/LoginScreen';
import { SettingsView } from './components/SettingsView';
import { MOCK_EVENTS } from './constants';
import { EventData, ViewState } from './types';
import { LayoutDashboard, Calendar, List, Settings, LogOut, Menu, X, Plus } from 'lucide-react';

const App: React.FC = () => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // App State
  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [events, setEvents] = useState<EventData[]>(MOCK_EVENTS); // MOCK_EVENTS is now empty
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);

  // Check login status on mount
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (loggedIn) {
      setIsAuthenticated(true);
    }
    setIsLoadingAuth(false);
  }, []);

  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsAuthenticated(true);
    setCurrentView('DASHBOARD');
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsAuthenticated(false);
    setSelectedEvent(null);
    setCurrentView('DASHBOARD');
  };

  const handleUpdateEvent = (updated: EventData) => {
    setEvents(prev => prev.map(e => e.id === updated.id ? updated : e));
    setSelectedEvent(updated);
  };

  const handleAddEvent = (newEvent: EventData) => {
    setEvents(prev => [...prev, newEvent]);
    setIsAddEventModalOpen(false);
    setSelectedEvent(newEvent);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    if (selectedEvent && selectedEvent.id === id) {
      setSelectedEvent(null);
    }
  };

  const NavItem = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setSelectedEvent(null);
        setIsMobileMenuOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        currentView === view && !selectedEvent
          ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-900/50' 
          : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  if (isLoadingAuth) return null; // Or a loading spinner

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-zinc-950 border-b border-zinc-800 z-50 flex justify-between items-center p-4">
        <Logo size="sm" />
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
           {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 bg-zinc-950 border-r border-zinc-800 transform transition-transform duration-200 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        md:flex flex-col p-6
      `}>
        <div className="mb-8 hidden md:block">
          <Logo />
        </div>

        {/* Create Button */}
        <button 
          onClick={() => { setIsAddEventModalOpen(true); setIsMobileMenuOpen(false); }}
          className="w-full bg-zinc-100 hover:bg-white text-black py-3 rounded-lg font-bold flex items-center justify-center gap-2 mb-8 transition-colors shadow-lg shadow-white/5"
        >
          <Plus size={20} /> Nouveau
        </button>
        
        {/* Mobile Spacer */}
        <div className="h-16 md:hidden"></div>

        <nav className="flex-1 space-y-2">
          <NavItem view="DASHBOARD" icon={LayoutDashboard} label="Tableau de bord" />
          <NavItem view="EVENTS" icon={List} label="Événements" />
          <NavItem view="CALENDAR" icon={Calendar} label="Calendrier" />
        </nav>

        <div className="pt-6 border-t border-zinc-800 space-y-2">
          <button 
            onClick={() => { setCurrentView('SETTINGS'); setSelectedEvent(null); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === 'SETTINGS' ? 'text-white bg-zinc-800' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Settings size={20} />
            <span className="font-medium">Paramètres</span>
          </button>
          <div className="flex items-center gap-3 px-4 py-3 mt-4 bg-zinc-900 rounded-lg border border-zinc-800">
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-fuchsia-500 to-purple-600 flex items-center justify-center font-bold text-xs shrink-0">
                AD
             </div>
             <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-white truncate">Admin</p>
                <p className="text-xs text-zinc-500 truncate">Propriétaire</p>
             </div>
             <button onClick={handleLogout} title="Se déconnecter">
                <LogOut size={16} className="text-zinc-500 hover:text-red-500 transition-colors cursor-pointer" />
             </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-hidden relative pt-16 md:pt-0">
        <div className="h-full overflow-y-auto p-4 md:p-8 max-w-7xl mx-auto custom-scrollbar">
          {selectedEvent ? (
            <EventDetail 
              event={selectedEvent} 
              onBack={() => setSelectedEvent(null)}
              onUpdate={handleUpdateEvent}
              onDelete={handleDeleteEvent}
            />
          ) : (
            <>
              {currentView === 'DASHBOARD' && <Dashboard events={events} />}
              {currentView === 'EVENTS' && <EventList events={events} onSelectEvent={setSelectedEvent} onDeleteEvent={handleDeleteEvent} />}
              {currentView === 'CALENDAR' && <CalendarView events={events} onSelectEvent={setSelectedEvent} />}
              {currentView === 'SETTINGS' && <SettingsView />}
            </>
          )}
        </div>
      </main>

      {/* Modals */}
      {isAddEventModalOpen && (
        <AddEventModal 
          isOpen={true}
          onClose={() => setIsAddEventModalOpen(false)}
          onAdd={handleAddEvent}
        />
      )}

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
