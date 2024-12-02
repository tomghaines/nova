// useCalendarList.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import supabase from '@/utils/supabase/client';
import type CalendarEvent from '@/@types/data/catalyst-calendar/calendar-event';
import type Token from '@/@types/data/catalyst-calendar/token';

export function useCalendarList() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [tokenData, setTokenData] = useState<Record<string, Token>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 100;

  const fetchData = useCallback(async (page: number) => {
    try {
      setIsLoading(true);

      const eventsResponse = await fetch(
        `/api/catalyst-calendar?page=${page}&pageSize=${pageSize}`
      );
      const eventsData: CalendarEvent[] = await eventsResponse.json();

      // If we get fewer events than pageSize, we've reached the end
      if (eventsData.length < pageSize) {
        setHasMore(false);
      }

      const tokenIds = Array.from(
        new Set(eventsData.map((event) => event.coin_id))
      );

      const { data: coins, error: supabaseError } = await supabase
        .from('tokens')
        .select('id, name, symbol, image_64')
        .in('id', tokenIds);

      if (supabaseError) throw supabaseError;

      const tokenMap = (coins || []).reduce<Record<string, Token>>(
        (acc, token) => ({
          ...acc,
          [token.id]: {
            id: token.id,
            name: token.name,
            symbol: token.symbol,
            image_64: token.image_64
          }
        }),
        {}
      );

      // For first page, replace events. For subsequent pages, append
      setEvents((prevEvents) =>
        page === 1 ? eventsData : [...prevEvents, ...eventsData]
      );
      setTokenData((prevTokens) => ({ ...prevTokens, ...tokenMap }));
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Error fetching data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  // Function to load more data
  const loadMore = async () => {
    if (!isLoading && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      await fetchData(nextPage);
    }
  };

  // Function to refresh data
  const refresh = async () => {
    setCurrentPage(1);
    setHasMore(true);
    await fetchData(1);
  };

  return {
    events,
    tokenData,
    isLoading,
    error,
    hasMore,
    loadMore,
    refresh
  };
}
