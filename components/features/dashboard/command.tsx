import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Sparkles, Star } from 'lucide-react';
import { useCoin } from '@/app/context/CoinContext';

export function SearchBar() {
  const { setSelectedCoinSymbol } = useCoin();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const [selectedToken, setSelectedToken] = useState({
    value: '$BTC',
    icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
    trend: '+2.4%',
    popular: true
  });

  const tokens = [
    {
      value: '$BTC',
      icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
      trend: '+2.4%',
      popular: true
    },
    {
      value: '$ETH',
      icon: 'https://cdn.worldvectorlogo.com/logos/ethereum-eth.svg',
      trend: '+1.8%',
      popular: true
    },
    {
      value: '$SOL',
      icon: 'https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png',
      trend: '+5.2%',
      popular: true
    }
  ];

  const narratives = [
    { value: 'DeFi', description: 'Decentralized Finance' },
    { value: 'Meme', description: 'Community & Culture Tokens' },
    { value: 'RWA', description: 'Real World Assets' },
    { value: 'AI', description: 'Artificial Intelligence' },
    { value: 'DePin', description: 'Decentralized Physical Infrastructure' }
  ];

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 300); // Delay before closing to allow smooth movement to dropdown
  };

  const onSelectToken = (
    token: (typeof tokens)[0] | { value: string; icon: string }
  ) => {
    setSelectedToken({
      ...token,
      trend: token.trend || '+0.0%',
      popular: !!token.popular
    });
    setSelectedCoinSymbol(token.value.replace('$', ''));
    setIsOpen(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className='relative w-full max-w-xs'
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`flex w-full items-center justify-between gap-3 rounded-xl border border-zinc-800/30 bg-zinc-900/90 px-3.5 py-2.5 transition-all duration-200 ${isOpen ? 'border-zinc-700/40 bg-zinc-900/95 shadow-lg' : 'hover:border-zinc-700/40 hover:bg-zinc-900/95 hover:shadow-lg'}`}
      >
        <div className='flex items-center gap-3'>
          <div className='flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-800/60 p-1.5 transition-transform duration-200 hover:scale-105'>
            <img
              src={selectedToken.icon || '/api/placeholder/24/24'}
              className='h-full w-full'
              alt={selectedToken.value}
            />
          </div>
          <div className='flex flex-col items-start'>
            <span className='text-sm font-medium text-zinc-100'>
              {selectedToken.value}
            </span>
            {selectedToken.trend && (
              <span
                className={`text-xs ${selectedToken.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}
              >
                {selectedToken.trend}
              </span>
            )}
          </div>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-zinc-400 transition-transform duration-300 ease-out ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </div>

      <div
        className={`absolute top-full z-50 mt-2 w-[280px] -translate-x-[calc(280px-100%)] transition-all duration-200 ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className='rounded-xl border border-zinc-800/30 bg-zinc-900/95 p-2 shadow-xl backdrop-blur-sm'>
          <div className='space-y-1.5'>
            <div className='flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-zinc-500'>
              <Star className='h-3.5 w-3.5' /> Popular Tokens
            </div>
            {tokens.map((token) => (
              <button
                key={token.value}
                onClick={() => onSelectToken(token)}
                className='flex w-full items-center justify-between rounded-lg px-2 py-2 text-zinc-300 transition-all duration-150 hover:bg-zinc-800/50'
              >
                <div className='flex items-center gap-3'>
                  <div className='flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-800/60 p-1.5'>
                    <img
                      src={token.icon}
                      className='h-full w-full'
                      alt={token.value}
                    />
                  </div>
                  <span className='text-sm font-medium'>{token.value}</span>
                </div>
                <span
                  className={`text-xs ${token.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}
                >
                  {token.trend}
                </span>
              </button>
            ))}
          </div>

          <div className='my-2 h-px bg-zinc-800/30' />

          <div className='space-y-1.5'>
            <div className='flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-zinc-500'>
              <Sparkles className='h-3.5 w-3.5' /> Narratives
            </div>
            {narratives.map((narrative) => (
              <button
                key={narrative.value}
                onClick={() =>
                  onSelectToken({ value: narrative.value, icon: '' })
                }
                className='group flex w-full items-center justify-between rounded-lg px-2 py-2 text-zinc-300 transition-all duration-150 hover:bg-zinc-800/50'
              >
                <div className='flex items-center gap-3'>
                  <div className='flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-800/60 text-xs font-medium text-zinc-400'>
                    {narrative.value.slice(0, 2)}
                  </div>
                  <div className='flex flex-col items-start'>
                    <span className='text-sm font-medium'>
                      {narrative.value}
                    </span>
                    <span className='text-xs text-zinc-500 transition-all group-hover:text-zinc-400'>
                      {narrative.description}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
