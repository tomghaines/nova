'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@radix-ui/themes';
import { GrPowerReset } from 'react-icons/gr';
import CalendarEvent from '@/@types/data/catalyst-calendar/calendar-event';
import { eventTypeToColor } from '@/@types/data/catalyst-calendar/event-badge-colors';

export default function FilterEvents({
  events,
  setFilteredEvents
}: {
  events: CalendarEvent[];
  setFilteredEvents: (events: CalendarEvent[]) => void;
}) {
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(
    new Set()
  );

  // Toggle selected filter
  const handleFilterToggle = (eventType: string) => {
    setSelectedFilters((prev) => {
      const newFilters = new Set(prev);
      if (newFilters.has(eventType)) {
        newFilters.delete(eventType); // Remove filter
      } else {
        newFilters.add(eventType);
      }
      return newFilters;
    });
  };

  const resetFilters = () => {
    setSelectedFilters(new Set());
  };

  // Filter and sort events based on selected filters
  useEffect(() => {
    const filteredEvents = events.filter(
      (event) =>
        selectedFilters.size === 0 || selectedFilters.has(event.eventType)
    );

    // Sort the filtered events by date_start (soonest to latest)
    const sortedEvents = filteredEvents.sort(
      (a, b) =>
        new Date(a.date_start).getTime() - new Date(b.date_start).getTime()
    );

    // Update filtered events in the parent component
    setFilteredEvents(sortedEvents);
  }, [selectedFilters, events, setFilteredEvents]); // Re-run whenever selectedFilters or events change

  // Get unique event types from the events
  const uniqueEventTypes = Array.from(
    new Set(events.map((event) => event.eventType))
  );

  return (
    <div className='flex h-fit flex-col gap-4 rounded-lg bg-neutral-800 px-3 py-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl'>Filter</h2>
        <div
          onClick={resetFilters}
          className='flex cursor-pointer items-center gap-1 rounded-md p-1 text-sm text-indigo-400 hover:bg-neutral-700'
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
                selectedFilters.has(eventType)
                  ? 'border-2 border-indigo-400'
                  : ''
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
