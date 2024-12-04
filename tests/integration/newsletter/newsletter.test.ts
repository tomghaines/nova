import { describe, test, vi, expect, beforeEach } from 'vitest';
import { POST } from '@/app/api/newsletter/signup/route';
import { addSubscriber } from '@/utils/newsletter/controller';
import { NextRequest } from 'next/server';

// Create a mock NextRequest object
const createMockRequest = (body = {}) => {
  return {
    json: jest.fn().mockResolvedValue(body),
    headers: {
      get: jest.fn((header) => (header === 'Content-Type' ? 'application/json' : null)),
    },
  };
};

// Mock Supabase client
vi.mock('@/utils/supabase/client', () => {
  const supabaseMock = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
    insert: vi.fn(),
  };
  return { default: supabaseMock }; // Mock default export for Supabase client
});

// Mock addSubscriber utility
vi.mock('@/utils/newsletter/controller', () => ({
  addSubscriber: vi.fn(),
}));

describe('POST /api/newsletter/signup', () => {
  const validRequest = new NextRequest('http://localhost/api/newsletter/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@gmail.com' }),
  });
  

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test('should subscribe successfully with a new email', async () => {
    const supabase = (await import('@/utils/supabase/client')).default;

    supabase.single.mockResolvedValueOnce({ data: null, error: null }); // No existing subscriber
    addSubscriber.mockResolvedValueOnce(); // Mock successful subscription

    const mockRequest = createMockRequest({ email: 'test@gmail.com' });
    const response = await POST(mockRequest);

    expect(response.status).toBe(200);
    const jsonResponse = await response.json();
    expect(jsonResponse.message).toBe('Subscribed successfully');

    // Verify Supabase and addSubscriber were called
    expect(supabase.from).toHaveBeenCalledWith('subscribers');
    expect(supabase.select).toHaveBeenCalledWith('email');
    expect(supabase.eq).toHaveBeenCalledWith('email', 'test@gmail.com');
    expect(supabase.single).toHaveBeenCalledTimes(1);
    expect(addSubscriber).toHaveBeenCalledWith('test@gmail.com');
  });

  test('should return 409 if email already exists', async () => {
    const supabase = (await import('@/utils/supabase/client')).default;

    supabase.single.mockResolvedValueOnce({ data: { email: 'test@gmail.com' }, error: null });

    const response = await POST(validRequest as any);

    expect(response.status).toBe(409);
    const jsonResponse = await response.json();
    expect(jsonResponse.message).toBe("You've already signed up");

    expect(supabase.from).toHaveBeenCalledWith('subscribers');
    expect(supabase.select).toHaveBeenCalledWith('email');
    expect(supabase.eq).toHaveBeenCalledWith('email', 'test@gmail.com');
    expect(supabase.single).toHaveBeenCalledTimes(1);
    expect(addSubscriber).not.toHaveBeenCalled();
  });

  test('should handle Supabase errors gracefully', async () => {
    const supabase = (await import('@/utils/supabase/client')).default;

    supabase.single.mockResolvedValueOnce({
      data: null,
      error: { code: 'PGRST116', message: 'Supabase error' },
    });

    const response = await POST(validRequest as any);

    expect(response.status).toBe(500);
    const jsonResponse = await response.json();
    expect(jsonResponse.error).toBe('Failed to subscribe');

    expect(supabase.from).toHaveBeenCalledWith('subscribers');
    expect(supabase.select).toHaveBeenCalledWith('email');
    expect(supabase.eq).toHaveBeenCalledWith('email', 'test@gmail.com');
    expect(addSubscriber).not.toHaveBeenCalled();
  });

  test('should handle unexpected errors gracefully', async () => {
    const supabase = (await import('@/utils/supabase/client')).default;

    supabase.single.mockResolvedValueOnce({ data: null, error: null });
    addSubscriber.mockRejectedValueOnce(new Error('Unexpected error'));

    const response = await POST(validRequest as any);

    expect(response.status).toBe(500);
    const jsonResponse = await response.json();
    expect(jsonResponse.error).toBe('Failed to subscribe');

    expect(supabase.from).toHaveBeenCalledWith('subscribers');
    expect(supabase.select).toHaveBeenCalledWith('email');
    expect(supabase.eq).toHaveBeenCalledWith('email', 'test@gmail.com');
    expect(supabase.single).toHaveBeenCalledTimes(1);
    expect(addSubscriber).toHaveBeenCalledWith('test@gmail.com');
  });
});
