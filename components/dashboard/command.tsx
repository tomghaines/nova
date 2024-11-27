'use client';
import { useState } from 'react';

import { Command, CommandInput } from '@/components/ui/command';

export function CommandDemo() {
  const [isTokenOpen, setIsTokenOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className='flex w-full gap-5'>
      <div className='w-1/5'>
        <Command
          className='h-auto rounded-lg border shadow-md dark:shadow-lg dark:shadow-gray-500'
          onBlur={() => setIsTokenOpen(false)}
        >
          <CommandInput
            onFocus={() => setIsTokenOpen(true)}
            className='w-full'
          />
        </Command>
      </div>

      <div className='w-4/5'>
        <Command
          className='h-auto rounded-lg border shadow-md dark:shadow-lg dark:shadow-gray-500'
          onBlur={() => setIsSearchOpen(false)}
        >
          <CommandInput
            placeholder='Type keywords or topics...'
            onFocus={() => setIsSearchOpen(true)}
            className='w-full'
          />
        </Command>
      </div>
    </div>
  );
}
