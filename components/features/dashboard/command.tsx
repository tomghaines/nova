'use client';
import { MouseEvent, useState } from 'react';

import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandSeparator
} from '@/components/ui/command';

import { Button } from '@/components/ui/button';

export function SearchBar() {
  const [isTokenOpen, setIsTokenOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState('$BTC');
  const [selectedToken, setSelectedToken] = useState('$BTC');

  const onSelectToken = (e: MouseEvent) => {
    e.preventDefault();
    setSelectedToken((e.target as HTMLElement).innerText);
    setIsTokenOpen(false);
  };

  return (
    <div className='flex w-full items-center gap-5'>
      <div className='relative w-full'>
        <Command
          className='mx-auto h-auto w-full max-w-[860px] rounded-lg border border-zinc-100 shadow-lg shadow-md dark:border-zinc-500 dark:shadow-gray-500'
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
            <CommandList
              onClick={onSelectToken}
              className='absolute top-full z-50 w-full bg-white shadow-lg dark:bg-gray-800'
            >
              <CommandGroup heading='Tokens'>
                <CommandItem value='$BTC'>
                  <img
                    src='https://cryptologos.cc/logos/bitcoin-btc-logo.png'
                    className='ml-2 h-4 w-4'
                  />
                  <span className='text-base font-semibold'>$BTC</span>
                </CommandItem>
                <CommandItem value='$ETH'>
                  <img
                    src='https://cdn.worldvectorlogo.com/logos/ethereum-eth.svg'
                    className='ml-2 h-4 w-4'
                  />
                  <span className='text-base font-semibold'>$ETH</span>
                </CommandItem>
                <CommandItem value='$SOL'>
                  <img
                    src='https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png'
                    className='ml-2 h-4 w-4'
                  />
                  <span className='text-base font-semibold'>$SOL</span>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading='Narratives'>
                <CommandItem value='DeFi'>
                  <span className='ml-2 text-base'>DeFi</span>
                </CommandItem>
                <CommandItem value='Meme'>
                  <span className='ml-2 text-base'>Meme</span>
                </CommandItem>
                <CommandItem value='RWA'>
                  <span className='ml-2 text-base'>RWA</span>
                </CommandItem>
                <CommandItem value='AI'>
                  <span className='ml-2 text-base'>AI</span>
                </CommandItem>
                <CommandItem value='DePin'>
                  <span className='ml-2 text-base'>DePin</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          )}
        </Command>
      </div>
      <div>
        <Button className='grey-400 ml-auto h-11 font-semibold shadow-md dark:shadow-lg dark:shadow-gray-500'>
          ENTER
        </Button>
      </div>
    </div>
  );
}
