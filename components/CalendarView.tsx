import React from 'react';
import { EventData } from '../types';

interface CalendarViewProps {
  events: EventData[];
  onSelectEvent: (event: EventData) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ events, onSelectEvent }) => {
  // Generate a simple 30-day grid starting today
  const today = new Date();
  const days = Array.from({ length: 28 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Calendrier</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
        {days.map((day, i) => {
          const dateStr = day.toISOString().split('T')[0];
          const dayEvents = events.filter(e => e.date.startsWith(dateStr));
          const isToday = i === 0;

          return (
            <div key={i} className={`min-h-[100px] bg-zinc-900 border ${isToday ? 'border-fuchsia-500' : 'border-zinc-800'} rounded-lg p-2 flex flex-col gap-2`}>
              <span className={`text-sm font-medium ${isToday ? 'text-fuchsia-500' : 'text-zinc-400'}`}>
                {day.toLocaleDateString('fr-CA', { day: 'numeric', month: 'short' })}
              </span>
              
              {dayEvents.map(evt => (
                <div 
                  key={evt.id}
                  onClick={() => onSelectEvent(evt)}
                  className="bg-zinc-800 hover:bg-zinc-700 text-xs p-1.5 rounded cursor-pointer border-l-2 border-fuchsia-500 truncate text-white transition-colors"
                >
                  {evt.startTime} {evt.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};
