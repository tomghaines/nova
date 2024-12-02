import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { ChartData } from '@/@types/data/SentimentData';

interface NewsSentimentProps {
  data: ChartData;
}

const NewsSentiment: React.FC<NewsSentimentProps> = () => {
  const sources = [
    { name: 'Major News Outlets', score: 0.82 },
    { name: 'Social Media', score: 0.65 },
    { name: 'Crypto Publications', score: 0.91 }
  ];

  return (
    <div className='flex h-full flex-col justify-between rounded-lg border-[1px] border-neutral-900/40 bg-neutral-800/30 p-4'>
      <h3 className='mb-3 text-sm font-medium text-white/60'>News Sentiment</h3>
      <div className='space-y-3'>
        {sources.map((source) => (
          <div key={source.name} className='flex items-center justify-between'>
            <span className='text-xs text-white/40'>{source.name}</span>
            <div className='flex items-center gap-1'>
              <span
                className={`text-sm font-medium ${
                  source.score > 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {source.score > 0 ? '+' : ''}
                {source.score.toFixed(2)}
              </span>
              {source.score > 0 ? (
                <TrendingUp className='h-3 w-3 text-emerald-400' />
              ) : (
                <TrendingDown className='h-3 w-3 text-red-400' />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsSentiment;
