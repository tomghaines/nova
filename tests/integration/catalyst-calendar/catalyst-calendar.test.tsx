import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { vi, expect, test, beforeEach, describe } from 'vitest';
import CatalystCalendar from '@/app/(protected)/catalyst-calendar/page';

// Mock the useCalendarList hook
vi.mock('@/hooks/api/use-calendar-list', () => ({
  useCalendarList: vi.fn()
}));

const mockUseCalendarList = vi.fn();

describe('CatalystCalendar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('displays a loading spinner when loading', () => {
    mockUseCalendarList.mockReturnValue({
      isLoading: true,
      events: [],
      tokenData: {},
      error: null,
      hasMore: false,
      loadMore: vi.fn()
    });

    render(<CatalystCalendar />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('displays an error message when there is an error', () => {
    mockUseCalendarList.mockReturnValue({
      isLoading: false,
      events: [],
      tokenData: {},
      error: 'Failed to load events',
      hasMore: false,
      loadMore: vi.fn()
    });

    render(<CatalystCalendar />);
    expect(
      screen.getByText(/Error: Failed to load events/i)
    ).toBeInTheDocument();
  });

  test('renders events when data is loaded successfully', () => {
    const mockEvents = [
      {
        id: '1',
        title: 'Test Event',
        start: new Date().toISOString(),
        end: new Date().toISOString()
      }
    ];

    mockUseCalendarList.mockReturnValue({
      isLoading: false,
      events: mockEvents,
      tokenData: {},
      error: null,
      hasMore: false,
      loadMore: vi.fn()
    });

    render(<CatalystCalendar />);
    expect(screen.getByText('Test Event')).toBeInTheDocument();
  });
});
