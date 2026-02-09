import React from 'react';
import { EventData, EventStatus } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Calendar, DollarSign, CheckCircle, Clock, Bell, AlertCircle } from 'lucide-react';

interface DashboardProps {
  events: EventData[];
}

const COLORS = ['#d946ef', '#a855f7', '#6366f1', '#3f3f46'];

export const Dashboard: React.FC<DashboardProps> = ({ events }) => {
  
  // Quick Stats
  const totalEvents = events.length;
  const confirmedEvents = events.filter(e => e.status === EventStatus.CONFIRMED || e.status === EventStatus.SIGNED).length;
  const pendingEvents = events.filter(e => e.status === EventStatus.INQUIRY || e.status === EventStatus.CONTRACT_SENT).length;
  
  // Calculate potential revenue (mock data logic)
  const potentialRevenue = events.reduce((acc, curr) => acc + (curr.contract?.amount || 0), 0);

  // Chart Data: Status Distribution
  const statusData = [
    { name: 'Confirmé/Signé', value: confirmedEvents },
    { name: 'En attente', value: pendingEvents },
    { name: 'Terminé', value: events.filter(e => e.status === EventStatus.COMPLETED).length },
  ];

  // Chart Data: Events per month (mock logic for demo)
  const monthlyData = [
    { name: 'Juin', events: 4 },
    { name: 'Juil', events: 8 },
    { name: 'Août', events: 12 },
    { name: 'Sept', events: 6 },
  ];

  // Calculate Active Reminders
  // A reminder is active if triggerTime <= now and not dismissed
  // Also showing upcoming reminders for the next 7 days for visibility
  const now = new Date();
  const upcomingReminders: { eventId: string; eventTitle: string; label: string; date: Date }[] = [];

  events.forEach(evt => {
    if (!evt.reminders) return;
    const eventDateTime = new Date(`${evt.date.split('T')[0]}T${evt.startTime}`);
    
    evt.reminders.forEach(rem => {
      if (rem.isDismissed) return;
      const triggerTime = new Date(eventDateTime.getTime() - rem.offsetMinutes * 60000);
      
      // If reminder is in the past (due) or in the near future (next 7 days)
      const diffHours = (triggerTime.getTime() - now.getTime()) / (1000 * 3600);
      
      // Show if overdue (negative diff) or upcoming within 7 days
      if (diffHours < (24 * 7)) {
        upcomingReminders.push({
          eventId: evt.id,
          eventTitle: evt.title,
          label: rem.label,
          date: triggerTime
        });
      }
    });
  });

  // Sort by date (urgent first)
  upcomingReminders.sort((a, b) => a.date.getTime() - b.date.getTime());

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl flex items-center justify-between hover:border-fuchsia-500/30 transition-colors">
      <div>
        <p className="text-zinc-400 text-sm font-medium uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-full bg-zinc-800 ${color}`}>
        <Icon size={24} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-white">Tableau de bord</h2>
        <span className="text-zinc-500 text-sm bg-zinc-900 py-1 px-3 rounded-full border border-zinc-800">
          Beatek Events Manager v1.0
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Événements" value={totalEvents} icon={Calendar} color="text-blue-500" />
        <StatCard title="Revenus Est." value={`$${potentialRevenue.toLocaleString()}`} icon={DollarSign} color="text-green-500" />
        <StatCard title="Confirmés" value={confirmedEvents} icon={CheckCircle} color="text-fuchsia-500" />
        <StatCard title="En attente" value={pendingEvents} icon={Clock} color="text-yellow-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Charts (Takes 2 cols) */}
        <div className="lg:col-span-2 space-y-6 min-w-0">
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-white mb-4">Statut des événements</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    >
                    {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    </Pie>
                    <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                    />
                </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 text-sm text-zinc-400 mt-2">
                {statusData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></span>
                    {entry.name}
                </div>
                ))}
            </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-white mb-4">Prévisions Saisonnière</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="name" stroke="#71717a" tickLine={false} axisLine={false} />
                    <YAxis stroke="#71717a" tickLine={false} axisLine={false} />
                    <Tooltip 
                    cursor={{fill: '#27272a'}}
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="events" fill="#d946ef" radius={[4, 4, 0, 0]} />
                </BarChart>
                </ResponsiveContainer>
            </div>
            </div>
        </div>

        {/* Right Column - Reminders */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl overflow-hidden flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Bell className="text-fuchsia-500" size={20} /> Rappels
                </h3>
                {upcomingReminders.length > 0 && (
                    <span className="bg-fuchsia-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{upcomingReminders.length}</span>
                )}
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar -mr-2 pr-2 space-y-3 max-h-[500px]">
                {upcomingReminders.length === 0 ? (
                    <div className="text-center py-8 text-zinc-500">
                        <CheckCircle size={32} className="mx-auto mb-2 opacity-20" />
                        <p className="text-sm">Aucun rappel à venir</p>
                    </div>
                ) : (
                    upcomingReminders.map((rem, idx) => {
                        const isOverdue = rem.date.getTime() < now.getTime();
                        return (
                            <div key={idx} className={`p-3 rounded-lg border flex flex-col gap-1 ${isOverdue ? 'bg-red-500/10 border-red-500/20' : 'bg-zinc-800/50 border-zinc-700/50'}`}>
                                <div className="flex justify-between items-start">
                                    <span className={`text-xs font-bold uppercase tracking-wider ${isOverdue ? 'text-red-400' : 'text-fuchsia-400'}`}>
                                        {isOverdue ? 'En retard' : rem.date.toLocaleDateString('fr-CA', {day: 'numeric', month: 'short'})}
                                    </span>
                                    {!isOverdue && <span className="text-xs text-zinc-500">{rem.date.toLocaleTimeString('fr-CA', {hour: '2-digit', minute:'2-digit'})}</span>}
                                </div>
                                <h4 className="font-semibold text-white text-sm">{rem.eventTitle}</h4>
                                <p className="text-zinc-400 text-xs flex items-center gap-1">
                                    <AlertCircle size={10} /> {rem.label}
                                </p>
                            </div>
                        );
                    })
                )}
            </div>
            <div className="mt-4 pt-4 border-t border-zinc-800">
                <p className="text-xs text-zinc-500 text-center">
                    Les rappels se déclenchent automatiquement selon la date de l'événement.
                </p>
            </div>
        </div>

      </div>
    </div>
  );
};
