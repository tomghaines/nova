'use client';

import { useEffect, useCallback } from 'react';
import { Badge } from '@radix-ui/themes';
import { GrPowerReset } from 'react-icons/gr';
import CalendarEvent from '@/@types/data/catalyst-calendar/calendar-event';
import { eventTypeToColor } from '@/@types/data/catalyst-calendar/event-badge-colors';

interface FilterEventsProps {
  events: CalendarEvent[];
  setFilteredEvents: (events: CalendarEvent[]) => void;
  activeFilters: Set<string>;
  setActiveFilters: React.Dispatch<React.SetStateAction<Set<string>>>;
}

export default function FilterEvents({
  events,
  setFilteredEvents,
  activeFilters,
  setActiveFilters
}: FilterEventsProps) {
  const applyFilters = useCallback(() => {
    if (activeFilters.size === 0) {
      // If no filters, show only first 100 events
      setFilteredEvents(events.slice(0, 100));
    } else {
      // If filters are active, apply them
      const filteredEvents = events.filter((event) =>
        activeFilters.has(event.eventType)
      );

      const sortedEvents = filteredEvents.sort(
        (a, b) =>
          new Date(a.date_start).getTime() - new Date(b.date_start).getTime()
      );

      setFilteredEvents(sortedEvents);
    }
  }, [events, activeFilters, setFilteredEvents]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleFilterToggle = (eventType: string) => {
    setActiveFilters((prev) => {
      const newFilters = new Set(prev);
      if (newFilters.has(eventType)) {
        newFilters.delete(eventType);
      } else {
        newFilters.add(eventType);
      }
      return newFilters;
    });
  };

  const resetFilters = () => {
    setActiveFilters(new Set());
  };

  const uniqueEventTypes = Array.from(
    new Set(events.map((event) => event.eventType))
  );

  return (
    <div className='flex h-fit flex-col gap-4 rounded-lg border-[1px] border-neutral-300 bg-neutral-200 px-3 py-4 dark:border-neutral-700 dark:bg-neutral-800'>
      <div className='flex items-center justify-between dark:text-neutral-400'>
        <h2 className='text-2xl'>Filter</h2>
        <div
          onClick={resetFilters}
          className='hover:border-neutral- flex cursor-pointer items-center gap-1 rounded-md p-1 text-sm text-indigo-400 hover:bg-neutral-300 dark:hover:border-neutral-500 dark:hover:bg-neutral-700'
        >
          <GrPowerReset />
          <p>Reset Filters</p>
        </div>
      </div>
      <div className='flex flex-col items-start gap-2'>
        <h3>Event Type</h3>
        <div className='flex max-w-80 flex-wrap gap-2'>
          {uniqueEventTypes.map((eventType) => (
            <Badge
              key={eventType}
              className={`cursor-pointer rounded-md px-1 ${
                activeFilters.has(eventType) ? 'border-2 border-indigo-400' : ''
              }`}
              color={
                eventTypeToColor[eventType as keyof typeof eventTypeToColor]
              }
              onClick={() => handleFilterToggle(eventType)}
            >
              {eventType}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
