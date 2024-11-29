import { it, expect, describe } from 'vitest';
import supabase from '../../../utils/supabase/client';

describe('Supabase Session', () => {
  it('should clear user session', async () => {
    const { data, error } = await supabase.auth.getSession();
    expect(error).toBeNull();

    await supabase.auth.signOut();

    const { data: afterSignOutData, error: afterSignOutError } =
      await supabase.auth.getSession();
    expect(afterSignOutError).toBeNull();
    expect(afterSignOutData?.session).toBeNull();
  });
});
