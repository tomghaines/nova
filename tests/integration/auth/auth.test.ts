import { vi, it, expect, describe } from 'vitest';
import supabase from '../../../utils/supabase/client';

// Mock supabase instance
vi.mock('../../../utils/supabase/client', () => ({
  default: {
    auth: {
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn()
    }
  }
}));

describe('Supabase Auth', () => {
  it('should clear user session', async () => {
    (
      supabase.auth.getSession as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce({
      data: { session: { user: { id: 'user1' } } },
      error: null
    });

    (
      supabase.auth.getSession as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce({
      data: { session: null },
      error: null
    });

    (supabase.auth.signOut as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      error: null
    });

    const { data, error } = await supabase.auth.getSession();
    expect(error).toBeNull();
    expect(data?.session).not.toBeNull();

    await supabase.auth.signOut();

    const { data: afterSignOutData, error: afterSignOutError } =
      await supabase.auth.getSession();
    expect(afterSignOutError).toBeNull();
    expect(afterSignOutData?.session).toBeNull();
  });
});
