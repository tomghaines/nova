import { vi } from 'vitest';

export const mockSupabaseClient = {
  auth: {
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
    getSession: vi.fn()
  }
};

vi.mock('../../../utils/supabase/client', () => ({
  default: mockSupabaseClient
}));
