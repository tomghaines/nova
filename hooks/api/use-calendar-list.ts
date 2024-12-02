'use client';

import { useState, useEffect, useCallback } from 'react';
import supabase from '@/utils/supabase/client';
import type CalendarEvent from '@/@types/data/catalyst-calendar/calendar-event';
import type Token from '@/@types/data/catalyst-calendar/token';

export function useCalendarList() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [tokenData, setTokenData] = useState<Record<string, Token>>({});
  const [tagData, setTagData] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 100;

  const fetchData = useCallback(
    async (page: number) => {
      try {
        setIsLoading(true);

        // Fetch event tags
        if (Object.keys(tagData).length === 0) {
          const { data: tags, error: tagError } = await supabase
            .from('event_tags')
            .select('id, name');

          if (tagError) throw tagError;

          const tagMap = (tags || []).reduce<Record<string, string>>(
            (acc, tag) => ({
              ...acc,
              [tag.id]: tag.name
            }),
            {}
          );

          setTagData(tagMap);
        }

        // Fetch events from backend proxy api
        const eventsResponse = await fetch(
          `/api/catalyst-calendar?page=${page}&pageSize=${pageSize}`
        );
        const eventsData: CalendarEvent[] = await eventsResponse.json();

        if (eventsData.length < pageSize) {
          setHasMore(false);
        }

        // Map tags to events
        const eventsWithTags = eventsData.map((event) => ({
          ...event,
          eventType: event.tags
            .split(',')
            .map((tagId) => tagData[tagId])
            .join(', ')
        }));

        const tokenIds = Array.from(
          new Set(eventsWithTags.map((event) => event.coin_id))
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

        setEvents((prevEvents) =>
          page === 1 ? eventsWithTags : [...prevEvents, ...eventsWithTags]
        );
        setTokenData((prevTokens) => ({ ...prevTokens, ...tokenMap }));
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Error fetching data');
      } finally {
        setIsLoading(false);
      }
    },
    [tagData]
  );

  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  const loadMore = async () => {
    if (!isLoading && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      await fetchData(nextPage);
    }
  };

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
