'use client';
import { MouseEvent, useState } from 'react';

import {
  Command,
  CommandInput,
  CommandList,
  CommandItem
} from '@/components/ui/command';

import { Button } from '@/components/ui/button';

export function SearchBar() {
  const [isTokenOpen, setIsTokenOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState('$BTC');
  const [selectedToken, setSelectedToken] = useState('$BTC');

  const onSelectToken = (e: MouseEvent) => {
    e.preventDefault();
    setSelectedToken((e.target as HTMLElement).innerText);
    setIsTokenOpen(false)
  };

  return (
    <div className='flex w-full items-center gap-5'>
      <div className='w-1/4'>
        <Command
          className='h-auto rounded-lg border shadow-md dark:shadow-lg dark:shadow-gray-500'
            value={selectedMenuItem}
            onValueChange={setSelectedMenuItem}
            onMouseEnter={() => setIsTokenOpen(true)}
            onMouseLeave={() => setIsTokenOpen(false)}
        >
          <CommandInput
            placeholder={selectedToken}
            className='w-full cursor-pointer'
          />
          {isTokenOpen && (
            <CommandList onClick={onSelectToken} className='absolute top-full z-50 w-1/5 bg-white shadow-lg dark:bg-gray-800'>
              <CommandItem value="$BTC">
                <img
                  src='https://cryptologos.cc/logos/bitcoin-btc-logo.png'
                  className='h-4 w-4'
                />
                <span className='text-base font-semibold'>$BTC</span>
              </CommandItem>
              <CommandItem value="$ETH">
                <img
                  src='https://cdn.worldvectorlogo.com/logos/ethereum-eth.svg'
                  className='h-4 w-4'
                />
                <span className='text-base font-semibold'>$ETH</span>
              </CommandItem>
              <CommandItem value="$SOL">
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
      <Button className='grey-400 ml-auto h-11 font-semibold shadow-md dark:shadow-lg dark:shadow-gray-500'>
        ENTER
      </Button>
    </div>
  );
}
