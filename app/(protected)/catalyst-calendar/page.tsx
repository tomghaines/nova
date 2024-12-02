// CatalystCalendar.tsx
'use client';

import { useState, useEffect } from 'react';
import EventItem from '@/components/catalyst-calendar/event-item';
import { Spinner } from '@/components/ui/spinner';
import { useCalendarList } from '@/hooks/api/use-calendar-list';
import { Button } from '@radix-ui/themes';

export default function CatalystCalendar() {
  const { events, tokenData, isLoading, error, hasMore, loadMore } =
    useCalendarList();
  const [loadingMore, setLoadingMore] = useState(false);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    await loadMore();
    setLoadingMore(false);
  };

  if (isLoading) return <Spinner />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='flex w-full flex-col space-y-8 p-6 text-neutral-400 dark:bg-zinc-800'>
      <h2 className='text-2xl font-bold text-neutral-300'>Catalyst Calendar</h2>
      {events && events.length > 0 ? (
        <>
          <table className='w-full'>
            <thead>
              <tr className='text-left text-neutral-300'>
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
              {events.map((event, index) => (
                <EventItem
                  key={`${event.coin_id}-${event.date_start}-${index}`}
                  event={event}
                  token={tokenData[event.coin_id]}
                />
              ))}
            </tbody>
          </table>
          {/* Load More Events Button */}
          {hasMore && (
            <div className='flex justify-center py-4'>
              <Button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className='min-w-[200px] cursor-pointer rounded-md bg-gray-200 p-3 hover:bg-gray-300 dark:bg-neutral-900 dark:hover:bg-neutral-700'
              >
                {loadingMore ? <Spinner size='small' /> : 'Load More Events'}
              </Button>
            </div>
          )}
        </>
      ) : (
        <p>No events Found</p>
      )}
    </div>
  );
}
