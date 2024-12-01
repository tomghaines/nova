'use client';

import { useState, useEffect } from 'react';
import supabase from '@/utils/supabase/client';
import type CalendarEvent from '@/@types/data/catalyst-calendar';

interface CoinData {
  id: string;
  image_64: string; // Changed from logo to image_64
}

export function useCalendarList() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [tokenData, setTokenData] = useState<Record<string, CoinData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const eventsResponse = await fetch('/api/catalyst-calendar');
        const eventsData: CalendarEvent[] = await eventsResponse.json();

        const tokenIds = Array.from(
          new Set(eventsData.map((event) => event.coin_id))
        );

        const { data: coins, error: supabaseError } = await supabase
          .from('tokens')
          .select('id, image_64')
          .in('id', tokenIds);

        if (supabaseError) throw supabaseError;

        const tokenMap = (coins || []).reduce<Record<string, CoinData>>(
          (acc, coin) => ({
            ...acc,
            [coin.id]: { id: coin.id, image_64: coin.image_64 }
          }),
          {}
        );

        setEvents(eventsData);
        setTokenData(tokenMap);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Error fetching data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { events, tokenData, isLoading, error };
}
