'use client';

import { useState, useCallback } from 'react';
import { Select } from '@radix-ui/themes';
import { Badge } from '@radix-ui/themes';
import { GrPowerReset } from 'react-icons/gr';
import { eventTypeToColor } from '@/@types/data/catalyst-calendar/event-badge-colors';
import { ProjectSearch } from './project-search';
import type Token from '@/@types/data/catalyst-calendar/token';
import type CalendarEvent from '@/@types/data/catalyst-calendar/calendar-event';

interface FilterEventsProps {
  events: CalendarEvent[];
  activeFilters: Set<string>;
  setActiveFilters: React.Dispatch<React.SetStateAction<Set<string>>>;
  onStartDateSortChange: (direction: string) => void;
  onEndDateSortChange: (direction: string) => void;
  tokenData: Record<string, Token>;
  projectFilters: Set<string>;
  setProjectFilter: React.Dispatch<React.SetStateAction<Set<string>>>;
}

export default function FilterEvents({
  events,
  tokenData,
  activeFilters,
  setActiveFilters,
  onStartDateSortChange,
  onEndDateSortChange,
  projectFilters,
  setProjectFilter
}: FilterEventsProps) {
  const [startDateValue, setStartDateValue] = useState('asc');
  const [endDateValue, setEndDateValue] = useState('asc');

  const handleFilterToggle = useCallback(
    (eventType: string) => {
      setActiveFilters((prev) => {
        const newFilters = new Set(prev);
        if (newFilters.has(eventType)) {
          newFilters.delete(eventType);
        } else {
          newFilters.add(eventType);
        }
        return newFilters;
      });
    },
    [setActiveFilters]
  );

  const resetFilters = useCallback(() => {
    setActiveFilters(new Set());
    setProjectFilter(new Set());
    setStartDateValue('asc');
    setEndDateValue('asc');
    onStartDateSortChange('asc');
    onEndDateSortChange('asc');
  }, [
    setActiveFilters,
    setProjectFilter,
    onStartDateSortChange,
    onEndDateSortChange
  ]);

  const uniqueProjects = Array.from(
    new Set(events.map((event) => tokenData[event.coin_id]?.symbol))
  ).filter(Boolean);

  const uniqueEventTypes = Array.from(
    new Set(events.map((event) => event.eventType))
  );

  return (
    <div className='flex h-fit min-w-[280px] max-w-[280px] flex-col gap-4 rounded-lg border-[1px] border-gray-300 bg-gray-100 px-3 py-4 dark:border-neutral-800 dark:bg-zinc-900'>
      <div className='flex items-center justify-between dark:text-neutral-400'>
        <h2 className='text-2xl'>Filter</h2>
        <div
          onClick={resetFilters}
          className='hover:border-neutral- flex cursor-pointer items-center gap-1 rounded-md p-1 text-sm text-emerald-500 hover:bg-gray-200 dark:hover:border-neutral-500 dark:hover:bg-neutral-700'
        >
          <GrPowerReset />
          <p>Reset Filters</p>
        </div>
      </div>
      <div className='flex flex-col items-start gap-2'>
        <h3>Sort By</h3>
        <div className='flex w-full justify-between'>
          <Select.Root
            value={startDateValue}
            onValueChange={(val) => {
              setStartDateValue(val);
              onStartDateSortChange(val);
            }}
          >
            <Select.Trigger className='h-8 w-[7rem] cursor-pointer border-2 bg-neutral-100 dark:bg-neutral-900 dark:text-neutral-400'>
              Date Start
            </Select.Trigger>
            <Select.Content>
              <Select.Item className='hover:bg-emerald-500' value='asc'>
                Date (Asc)
              </Select.Item>
              <Select.Item className='hover:bg-emerald-500' value='desc'>
                Date (Desc)
              </Select.Item>
              <Select.Item className='hover:bg-emerald-500' value='none'>
                None
              </Select.Item>
            </Select.Content>
          </Select.Root>
          <Select.Root
            value={endDateValue}
            onValueChange={(val) => {
              setEndDateValue(val);
              onEndDateSortChange(val);
            }}
          >
            <Select.Trigger className='h-8 w-[7rem] cursor-pointer border-2 bg-neutral-100 dark:bg-neutral-900 dark:text-neutral-400'>
              Date End
            </Select.Trigger>
            <Select.Content>
              <Select.Item className='hover:bg-emerald-500' value='asc'>
                Date (Asc)
              </Select.Item>
              <Select.Item className='hover:bg-emerald-500' value='desc'>
                Date (Desc)
              </Select.Item>
              <Select.Item className='hover:bg-emerald-500' value='none'>
                None
              </Select.Item>
            </Select.Content>
          </Select.Root>
        </div>
        <div className='flex w-full flex-col items-start gap-2'>
          <h3>Search By Project</h3>
          <ProjectSearch
            projects={uniqueProjects}
            onSelect={setProjectFilter}
            values={projectFilters}
            tokenData={tokenData}
          />
        </div>
        <h3>Event Type</h3>
        <div className='flex max-w-80 flex-wrap gap-2'>
          {uniqueEventTypes.map((eventType) => (
            <Badge
              key={eventType}
              className={`cursor-pointer rounded-md px-1 ${
                activeFilters.has(eventType)
                  ? 'border-2 border-emerald-500'
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
