'use client';

import { useState } from 'react';
import EventItem from '@/components/catalyst-calendar/event-item';
import FilterEvents from '@/components/catalyst-calendar/filter-events';
import { Spinner } from '@/components/ui/spinner';
import { useCalendarList } from '@/hooks/api/use-calendar-list';
import { Button } from '@radix-ui/themes';
import CalendarEvent from '@/@types/data/catalyst-calendar/calendar-event';

export default function CatalystCalendar() {
  const { events, tokenData, isLoading, error, hasMore, loadMore } =
    useCalendarList();

  // Initialize filteredEvents with the full events list
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>(events);

  const [loadingMore, setLoadingMore] = useState(false);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    await loadMore();
    setLoadingMore(false);
  };

  if (isLoading) return <Spinner />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='flex w-full flex-col gap-4 p-6 dark:bg-neutral-900 dark:text-neutral-400'>
      <h2 className='text-3xl font-bold dark:text-neutral-300'>
        Catalyst Calendar
      </h2>
      <p>
        The Catalyst Calendar assists in tracking events and catalysts for over
        1000+ tokens across crypto.
        <br />
        Events include DAO/Governance Votes, AMAs, Burns, Lock & Unlock, New
        Releases and more!
      </p>
      {/* Pass filteredEvents instead of events */}
      <div className='flex gap-4'>
        <FilterEvents events={events} setFilteredEvents={setFilteredEvents} />
        {filteredEvents && filteredEvents.length > 0 ? (
          <>
            <table className='w-full'>
              <thead>
                <tr className='text-left dark:text-neutral-300'>
                  <th className='p-2 font-medium'>Event Start Date</th>
                  <th className='p-2 font-medium'>Event End Date</th>
                  <th className='p-2 font-medium'>Project</th>
                  <th className='p-2 font-medium'>Event Type</th>
                  <th className='p-2 font-medium'>Description</th>
                  <th className='p-2 font-medium'>Source</th>
                  <th className='p-2 font-medium'>Ann. Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event: CalendarEvent, index: number) => (
                  <EventItem
                    key={`${event.coin_id}-${event.date_start}-${index}`}
                    event={event}
                    token={tokenData[event.coin_id]}
                  />
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <p>No events Found</p>
        )}
      </div>
      {/* Load More Events Button */}
      {hasMore && (
        <div className='flex justify-center'>
          <Button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className='min-w-[200px] cursor-pointer rounded-md bg-gray-200 p-3 hover:bg-gray-300 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
          >
            {loadingMore ? <Spinner size='small' /> : 'Load More Events'}
          </Button>
        </div>
      )}
    </div>
  );
}
