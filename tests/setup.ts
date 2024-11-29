import { vi } from 'vitest';

globalThis.fetch = vi.fn().mockResolvedValue({});

globalThis.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn().mockReturnValue('')
};
