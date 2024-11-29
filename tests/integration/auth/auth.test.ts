import { vi, it, expect, describe } from 'vitest';
import { mockSupabaseClient } from '@/tests/mocks/supabaseClientMock';

describe('Supabase Auth', () => {
  it('should clear user session', async () => {
    (
      mockSupabaseClient.auth.getSession as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce({
      data: { session: { user: { id: 'user1' } } },
      error: null
    });

    (
      mockSupabaseClient.auth.getSession as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce({
      data: { session: null },
      error: null
    });

    (
      mockSupabaseClient.auth.signOut as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce({
      error: null
    });

    const { data, error } = await mockSupabaseClient.auth.getSession();
    expect(error).toBeNull();
    expect(data?.session).not.toBeNull();

    await mockSupabaseClient.auth.signOut();

    const { data: afterSignOutData, error: afterSignOutError } =
      await mockSupabaseClient.auth.getSession();
    expect(afterSignOutError).toBeNull();
    expect(afterSignOutData?.session).toBeNull();
  });
});
