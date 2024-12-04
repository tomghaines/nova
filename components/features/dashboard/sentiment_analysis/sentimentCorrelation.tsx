import React from 'react';
import { ChartData } from '@/@types/data/SentimentData';

interface CorrelationProps {
  data: ChartData;
}

const SentimentCorrelation: React.FC<CorrelationProps> = () => {
  const correlations = [
    { name: 'BTC/ETH', type: 'Price', value: 0.85 },
    { name: 'Volume', type: 'Volume', value: 0.72 }
  ];

  return (
    <div className='flex flex-col justify-between rounded-lg border-[1px] border-neutral-900/40 bg-neutral-800/30 p-4'>
      <h3 className='mb-3 text-sm font-medium text-white/60'>
        Market Correlations
      </h3>
      <div className='grid grid-cols-2 gap-4'>
        {correlations.map((corr) => (
          <div key={corr.name} className='space-y-2'>
            <div className='text-xs text-white/40'>{corr.type}</div>
            <div className='flex items-center justify-between rounded-md bg-white/5 p-2'>
              <span className='text-sm text-white/80'>{corr.name}</span>
              <span className='text-sm font-medium text-emerald-400'>
                {corr.value.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SentimentCorrelation;
