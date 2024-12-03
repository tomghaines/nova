'use client';

import { useState, useEffect, useMemo } from 'react';
import EventItem from '@/components/features/catalyst-calendar/event-item';
import FilterEvents from '@/components/features/catalyst-calendar/filter-events';
import { useCalendarList } from '@/hooks/api/use-calendar-list';
import { Button } from '@radix-ui/themes';
import LoadingSpinner from '@/components/ui/loader';
import type CalendarEvent from '@/@types/data/catalyst-calendar/calendar-event';

export default function CatalystCalendar() {
  const {
    events,
    tokenData,
    isLoading,
    error,
    hasMore: originalHasMore,
    loadMore
  } = useCalendarList();

  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [visibleEvents, setVisibleEvents] = useState<number>(100);
  const [sortDirection, setSortDirection] = useState<string>('asc');
  const [projectFilters, setProjectFilters] = useState<Set<string>>(new Set());
  const [loadingMore, setLoadingMore] = useState(false);

  const filteredEvents = useMemo(() => {
    const filtered =
      activeFilters.size === 0
        ? events
        : events.filter((event) => activeFilters.has(event.eventType));

    const withProjectFilter =
      projectFilters.size > 0
        ? filtered.filter((event) =>
            projectFilters.has(tokenData[event.coin_id]?.symbol)
          )
        : filtered;

    return [...withProjectFilter].sort((a, b) => {
      const dateA = new Date(a.date_start).getTime();
      const dateB = new Date(b.date_start).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }, [events, activeFilters, projectFilters, sortDirection, tokenData]);

  const displayedEvents = useMemo(() => {
    if (activeFilters.size === 0) {
      return filteredEvents.slice(0, visibleEvents);
    }
    return filteredEvents;
  }, [filteredEvents, visibleEvents, activeFilters]);

  const handleLoadMore = async () => {
    try {
      setLoadingMore(true);
      await loadMore();
      setVisibleEvents((prev) => prev + 100);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setVisibleEvents(100);
  }, [activeFilters]);

  const showLoadMore =
    activeFilters.size === 0 && !projectFilters && originalHasMore;

  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <LoadingSpinner isLoading={isLoading} />
      </div>
    );
  }

  if (error) return <div>Error: {error}</div>;

  return (
    <div className='flex h-max w-full flex-col gap-4 p-16 dark:text-neutral-400'>
      <h2 className='text-3xl font-bold dark:text-neutral-300'>
        Catalyst Calendar
      </h2>
      <p>
        The Catalyst Calendar assists in tracking events and catalysts for over
        1000+ tokens across crypto.
        <br />
        Events include DAO/Governance Votes, AMAs, Burns, Lock & Unlock, New
        Releases, and more!
      </p>
      <div className='grid grid-cols-[280px_1fr] gap-4'>
        <FilterEvents
          events={events}
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
          onSortChange={setSortDirection}
          tokenData={tokenData}
          projectFilters={projectFilters}
          setProjectFilter={setProjectFilters}
        />
        <div className='w-full overflow-x-auto'>
          {displayedEvents && displayedEvents.length > 0 ? (
            <div>
              <table className='w-full table-fixed text-sm'>
                <thead>
                  <tr className='text-left dark:text-neutral-300'>
                    <th className='w-[110px] p-2 font-medium'>
                      Event Start Date
                    </th>
                    <th className='w-[110px] p-2 font-medium'>
                      Event End Date
                    </th>
                    <th className='w-[100px] p-2 font-medium'>Project</th>
                    <th className='w-[120px] p-2 font-medium'>Event Type</th>
                    <th className='w-[250px] p-2 font-medium'>Description</th>
                    <th className='w-[90px] p-2 font-medium'>Source</th>
                    <th className='w-[110px] p-2 font-medium'>Ann. Date</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedEvents.map(
                    (event: CalendarEvent, index: number) => (
                      <EventItem
                        key={`${event.coin_id}-${event.date_start}-${index}`}
                        event={event}
                        token={tokenData[event.coin_id]}
                      />
                    )
                  )}
                </tbody>
              </table>
              {showLoadMore && (
                <div className='flex justify-center'>
                  <Button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className='m-6 min-w-[200px] cursor-pointer rounded-md bg-gray-200 p-3 text-black hover:bg-gray-300 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
                  >
                    {loadingMore ? (
                      <LoadingSpinner isLoading={isLoading} />
                    ) : (
                      'Load More Events'
                    )}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <p>No events Found</p>
          )}
        </div>
      </div>
    </div>
  );
}
