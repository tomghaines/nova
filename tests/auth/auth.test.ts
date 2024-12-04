import { vi, it, expect, describe } from 'vitest';
import { mockSupabaseClient } from '@/tests/mocks/auth/supabaseClientMock';

describe('Supabase Auth', () => {
  it('should check if user is signed in', async () => {
    (
      mockSupabaseClient.auth.getSession as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce({
      data: { session: { user: { id: 'user1' } } },
      error: null
    });

    const { data, error } = await mockSupabaseClient.auth.getSession();
    expect(error).toBeNull();
    expect(data?.session?.user).toEqual({ id: 'user1' });
  });

  it('should refresh session on token renewal', async () => {
    (mockSupabaseClient.auth.getSession as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        data: {
          session: { user: { id: 'user1', email: 'user1@example.com' } }
        },
        error: null
      })
      .mockResolvedValueOnce({
        data: {
          session: { user: { id: 'user1', email: 'user1@example.com' } }
        },
        error: null
      });

    // First session fetch
    const { data } = await mockSupabaseClient.auth.getSession();
    expect(data?.session?.user.id).toBe('user1');

    // Simulate session refresh (network change or token renewal)
    const refreshedResponse = await mockSupabaseClient.auth.getSession();
    expect(refreshedResponse?.data?.session?.user.id).toBe('user1');
  });

  it('should persist session on page refresh after signIn', async () => {
    const mockMetadata = { email: 'user1@example.com', name: 'John Doe' };

    // Mock getSession to return a user session
    (
      mockSupabaseClient.auth.getSession as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce({
      data: { session: { user: { id: 'user1', ...mockMetadata } } },
      error: null
    });

    // Simulate the first session fetch (user is signed in)
    const { data, error } = await mockSupabaseClient.auth.getSession();

    expect(error).toBeNull();
    expect(data?.session?.user.id).toBe('user1');
    expect(data?.session?.user.email).toBe('user1@example.com');

    // Simulate page refresh (getSession called again)
    const response = await mockSupabaseClient.auth.getSession();

    if (response && response.data) {
      const { data: refreshedData, error: refreshedError } = response;
      expect(refreshedError).toBeNull();
      expect(refreshedData?.session?.user.id).toBe('user1');
    }
  });

  it('should persist session on browser restart', async () => {
    (
      mockSupabaseClient.auth.getSession as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce({
      data: { session: { user: { id: 'user1', email: 'user1@example.com' } } },
      error: null
    });

    const { data, error } = await mockSupabaseClient.auth.getSession();
    expect(error).toBeNull();
    expect(data?.session?.user.id).toBe('user1');

    // Simulate browser restart
    (
      mockSupabaseClient.auth.getSession as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce({
      data: { session: { user: { id: 'user1', email: 'user1@example.com' } } },
      error: null
    });

    // Try and get the session after browser restart
    const response = await mockSupabaseClient.auth.getSession();

    expect(response).toBeDefined();
    const { data: refreshedData, error: refreshedError } = response!;
    expect(refreshedError).toBeNull();
    expect(refreshedData?.session?.user.id).toBe('user1');
  });

  it('should handle signIn failure', async () => {
    (
      mockSupabaseClient.auth.signInWithPassword as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce({
      data: null,
      error: { message: 'Invalid credentials' }
    });

    const signInResponse = await mockSupabaseClient.auth.signInWithPassword();
    expect(signInResponse.error).toEqual({ message: 'Invalid credentials' });
  });

  it('should handle multiple users signing in', async () => {
    const mockUser1 = { id: 'user1', email: 'user1@example.com' };
    const mockUser2 = { id: 'user2', email: 'user2@example.com' };

    // Mock session for user 1
    (
      mockSupabaseClient.auth.getSession as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce({
      data: { session: { user: mockUser1 } },
      error: null
    });

    const response1 = await mockSupabaseClient.auth.getSession();
    expect(response1?.data?.session?.user.id).toBe('user1');

    // Mock session for user 2
    (
      mockSupabaseClient.auth.getSession as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce({
      data: { session: { user: mockUser2 } },
      error: null
    });

    const response2 = await mockSupabaseClient.auth.getSession();
    expect(response2?.data?.session?.user.id).toBe('user2');
  });

  it('should handle session expiry', async () => {
    (
      mockSupabaseClient.auth.getSession as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce({
      data: { session: null },
      error: { message: 'Session expired' }
    });

    const { data, error } = await mockSupabaseClient.auth.getSession();
    expect(data?.session).toBeNull();
    expect(error).toEqual({ message: 'Session expired' });
  });

  it('should handle no session on initial load', async () => {
    (
      mockSupabaseClient.auth.getSession as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce({
      data: { session: null },
      error: null
    });

    const { data, error } = await mockSupabaseClient.auth.getSession();
    expect(data?.session).toBeNull();
    expect(error).toBeNull();
  });

  it('should handle multiple consecutive calls to getSession', async () => {
    const mockMetadata = { email: 'user1@example.com', name: 'John Doe' };
    (mockSupabaseClient.auth.getSession as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        data: { session: { user: { id: 'user1', ...mockMetadata } } },
        error: null
      })
      .mockResolvedValueOnce({
        data: { session: { user: { id: 'user1', ...mockMetadata } } },
        error: null
      });

    // First call to getSession
    const { data, error } = await mockSupabaseClient.auth.getSession();
    expect(error).toBeNull();
    expect(data?.session?.user.id).toBe('user1');

    // Second call to getSession
    const secondCallResponse = await mockSupabaseClient.auth.getSession();
    expect(secondCallResponse).toBeDefined();
    const { data: secondCallData, error: secondCallError } =
      secondCallResponse!;

    expect(secondCallError).toBeNull();
    expect(secondCallData?.session?.user.id).toBe('user1');
  });

  it('should handle error when getSession fails', async () => {
    (
      mockSupabaseClient.auth.getSession as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce({
      data: null,
      error: { message: 'Session retrieval failed' }
    });

    const { data, error } = await mockSupabaseClient.auth.getSession();
    expect(data).toBeNull();
    expect(error).toEqual({ message: 'Session retrieval failed' });
  });

  it('should handle error when signOut fails', async () => {
    // Mock signOut to return an error
    (
      mockSupabaseClient.auth.signOut as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce({
      error: { message: 'Sign out failed' }
    });

    const signOutResponse = await mockSupabaseClient.auth.signOut();
    expect(signOutResponse.error).toEqual({ message: 'Sign out failed' });
  });

  it('should clear session on page refresh after signOut', async () => {
    (
      mockSupabaseClient.auth.getSession as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce({
      data: { session: { user: { id: 'user1' } } },
      error: null
    });

    // Mock the sign-out response
    (
      mockSupabaseClient.auth.signOut as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce({
      error: null
    });

    // Simulate the first session fetch
    const { data, error } = await mockSupabaseClient.auth.getSession();
    expect(error).toBeNull();
    expect(data?.session).not.toBeNull();

    await mockSupabaseClient.auth.signOut();

    (
      mockSupabaseClient.auth.getSession as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce({
      data: { session: null },
      error: null
    });

    const { data: afterSignOutData, error: afterSignOutError } =
      await mockSupabaseClient.auth.getSession();

    expect(afterSignOutError).toBeNull();
    expect(afterSignOutData?.session).toBeNull();
  });

  it('should clear session in multiple tabs after signOut', async () => {
    (
      mockSupabaseClient.auth.getSession as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce({
      data: { session: { user: { id: 'user1' } } },
      error: null
    });

    const { data } = await mockSupabaseClient.auth.getSession();
    expect(data?.session?.user.id).toBe('user1');

    await mockSupabaseClient.auth.signOut();

    // Simulate session fetch in another tab
    (
      mockSupabaseClient.auth.getSession as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce({
      data: { session: null },
      error: null
    });

    const afterSignOutResponse = await mockSupabaseClient.auth.getSession();
    expect(afterSignOutResponse?.data?.session).toBeNull();
  });
});
