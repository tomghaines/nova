'use client';
import { useState } from 'react';

import {
  Command,
  CommandInput,
  CommandList,
  CommandItem
} from '@/components/ui/command';

export function CommandDemo() {
  const [isTokenOpen, setIsTokenOpen] = useState(false);

  return (
    <div className='flex w-full gap-5'>
      <div className='w-1/4'>
        <Command
          className='h-auto rounded-lg border shadow-md dark:shadow-lg dark:shadow-gray-500'
          onBlur={() => setIsTokenOpen(false)}
        >
          <CommandInput
            onFocus={() => setIsTokenOpen(true)}
            className='w-full'
          />
          {isTokenOpen && (
            <CommandList>
              <CommandItem>
                <img
                  src='https://cryptologos.cc/logos/bitcoin-btc-logo.png'
                  className='h-4 w-4'
                />
                <span className='text-base font-semibold'>$BTC</span>
              </CommandItem>
              <CommandItem>
                <img
                  src='https://cdn.worldvectorlogo.com/logos/ethereum-eth.svg'
                  className='h-4 w-4'
                />
                <span className='text-base font-semibold'>$ETH</span>
              </CommandItem>
              <CommandItem>
                <img
                  src='https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png'
                  className='h-4 w-4'
                />
                <span className='text-base font-semibold'>$SOL</span>
              </CommandItem>
            </CommandList>
          )}
        </Command>
      </div>

      <div className='w-3/4'>
        <Command className='h-auto rounded-lg border shadow-md dark:shadow-lg dark:shadow-gray-500'>
          <CommandInput
            placeholder='Type keywords or topics...'
            className='w-full'
          />
        </Command>
      </div>
    </div>
  );
}
