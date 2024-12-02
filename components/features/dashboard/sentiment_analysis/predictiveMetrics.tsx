import React from 'react';
import { ChartData } from '@/@types/data/SentimentData';

interface PredictiveProps {
  data: ChartData;
}

const PredictiveMetrics: React.FC<PredictiveProps> = () => {
  const predictions = {
    confidence: 78,
    priceTarget: 45200,
    percentageChange: 5.2
  };

  return (
    <div className='flex h-1/3 flex-col justify-between rounded-lg border-[1px] border-neutral-900/40 bg-neutral-800/30 p-4'>
      <h3 className='mb-3 text-sm font-medium text-white/60'>AI Predictions</h3>
      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <div className='text-xs text-white/40'>24h Forecast</div>
          <div className='flex items-center justify-between rounded-md bg-emerald-500/5 p-2'>
            <span className='text-sm text-white/80'>Bullish</span>
            <span className='text-sm font-medium text-emerald-400'>
              {predictions.confidence}%
            </span>
          </div>
        </div>
        <div className='space-y-2'>
          <div className='text-xs text-white/40'>Price Target</div>
          <div className='flex items-center justify-between rounded-md bg-white/5 p-2'>
            <span className='text-sm text-white/80'>
              ${predictions.priceTarget.toLocaleString()}
            </span>
            <span className='text-xs text-emerald-400'>
              +{predictions.percentageChange}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictiveMetrics;
