import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(
      'https://coindar.org/api/v2/events?access_token=81515:1TI3025iFp2cQG5GZHN&page_size=100&filter_date_start=2024-01-12&sort_by=views&order_by=1'
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from Coindar API');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
