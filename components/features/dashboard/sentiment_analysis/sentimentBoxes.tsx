import React from 'react';
import { Zap } from 'lucide-react';

interface KeyPoint {
  point: string;
  type: 'bullish' | 'bearish';
}

interface SentimentBoxesProps {
  keyPoints: KeyPoint[];
}

const SentimentBox = ({
  points,
  type,
  totalPoints
}: {
  points: KeyPoint[];
  type: 'bullish' | 'bearish';
  totalPoints: number;
}) => {
  const sentiment = type === 'bullish';

  return (
    <div className='s flex h-full flex-col justify-between rounded-lg bg-neutral-800/30 p-4 backdrop-blur-sm'>
      {/* Header */}
      <div className='flex flex-col space-y-2'>
        <div className='flex items-center gap-2'>
          <span
            className={`text-sm ${sentiment ? 'text-emerald-500' : 'text-red-500'}`}
          >
            {points[0]?.point || 'No data available'}
          </span>
        </div>
        <div className='text-xs text-neutral-500'>
          {points.length} factors ·{' '}
          {((points.length / totalPoints) * 100).toFixed(0)}% of total
        </div>
      </div>

      {/* Footer */}
      <div className='flex items-center justify-between border-t border-neutral-800 pt-4'>
        <div className='flex items-center gap-2'>
          <Zap className='h-4 w-4 text-neutral-400' />
          <span className='text-xs text-neutral-400'>Market Impact</span>
        </div>
        <span
          className={`text-xs font-medium ${sentiment ? 'text-emerald-500' : 'text-red-500'}`}
        >
          {sentiment ? 'Strong Buy' : 'Strong Sell'}
        </span>
      </div>
    </div>
  );
};

const SentimentBoxes: React.FC<SentimentBoxesProps> = ({ keyPoints }) => {
  if (!keyPoints?.length) return null;

  const bullishPoints = keyPoints.filter((point) => point.type === 'bullish');
  const bearishPoints = keyPoints.filter((point) => point.type === 'bearish');
  const totalPoints = keyPoints.length;

  return (
    <div className='grid h-full grid-rows-2 gap-4'>
      <SentimentBox
        points={bullishPoints}
        type='bullish'
        totalPoints={totalPoints}
      />
      <SentimentBox
        points={bearishPoints}
        type='bearish'
        totalPoints={totalPoints}
      />
    </div>
  );
};

export default SentimentBoxes;
