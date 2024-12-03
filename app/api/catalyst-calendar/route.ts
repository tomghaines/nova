import CalendarEvent from '@/@types/data/catalyst-calendar/calendar-event';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filterImportant = searchParams.get('important') === 'true';
    const page = searchParams.get('page') || '1';
    const pageSize = searchParams.get('pageSize') || '100';

    const currentDate = new Date().toISOString().split('T')[0];

    const response = await fetch(
      `${process.env.COINDAR_API}&page=${page}&page_size=${pageSize}&filter_date_start=${currentDate}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from Coindar API');
    }

    const data = await response.json();

    const filteredData = filterImportant
      ? data.filter(
          (event: CalendarEvent) =>
            event.important === 'true' || event.important === true
        )
      : data;

    return NextResponse.json(filteredData);
  } catch (error) {
    console.error('Calendar request error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
