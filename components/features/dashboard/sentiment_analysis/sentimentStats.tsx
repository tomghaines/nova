import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import * as d3 from 'd3';

interface BarIndicatorProps {
  label: string;
  value: string;
  type?: 'sentiment' | 'price';
}

const BarIndicator: React.FC<BarIndicatorProps> = ({
  label,
  value,
  type = 'sentiment'
}) => {
  const numericValue = parseFloat(value);
  const isPercentage = value.toString().includes('%');

  const percentage =
    type === 'sentiment'
      ? ((numericValue + 0.6) / 1.2) * 100
      : (numericValue + 100) / 2;

  const getColor = (): string => {
    if (type === 'price') return '#60A5FA';
    return numericValue > 0 ? '#10B981' : '#EF4444';
  };

  const Icon = numericValue > 0 ? TrendingUp : TrendingDown;

  return (
    <div className='flex flex-col rounded-lg p-1.5'>
      <div className='flex w-full items-center justify-start gap-2'>
        <span className='text-[11px] text-white/60'>{label}</span>
        <Icon className='h-3.5 w-3.5' style={{ color: getColor() }} />
      </div>

      <div className='mt-1 flex items-center gap-2'>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='text-sm font-medium'
          style={{ color: getColor() }}
        >
          {isPercentage
            ? `${numericValue.toFixed(2)}%`
            : numericValue.toFixed(2)}
        </motion.span>
        <div className='relative h-[1.5px] flex-1 rounded-full bg-white/10'>
          <motion.div
            className='absolute left-0 top-0 h-full rounded-full'
            style={{ backgroundColor: getColor() }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.abs(percentage)}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
};

interface SentimentStatsProps {
  data: {
    weeklySentiment: Array<{
      sentiment_score: string;
      price: string;
    }>;
  };
}

const SentimentStats: React.FC<SentimentStatsProps> = ({ data }) => {
  const stats = React.useMemo(() => {
    if (!data?.weeklySentiment) return null;

    const sentiments = data.weeklySentiment.map((w) =>
      Number(w.sentiment_score)
    );
    const prices = data.weeklySentiment.map((w) => Number(w.price));

    const meanSentiment = d3.mean(sentiments);
    const maxSentiment = d3.max(sentiments);
    const minSentiment = d3.min(sentiments);

    if (!meanSentiment || !maxSentiment || !minSentiment) return null;

    return {
      avgSentiment: meanSentiment.toFixed(2),
      maxSentiment: maxSentiment.toFixed(2),
      minSentiment: minSentiment.toFixed(2),
      priceChange: (
        ((prices[prices.length - 1] - prices[0]) / prices[0]) *
        100
      ).toFixed(2)
    };
  }, [data]);

  if (!stats) return null;

  return (
    <div className='mb-[-0.75rem] grid w-full grid-cols-4 gap-1.5'>
      <BarIndicator label='Average Sentiment' value={stats.avgSentiment} />
      <BarIndicator label='Maximum Sentiment' value={stats.maxSentiment} />
      <BarIndicator label='Minimum Sentiment' value={stats.minSentiment} />
      <BarIndicator
        label='Price Change'
        value={stats.priceChange}
        type='price'
      />
    </div>
  );
};

export default SentimentStats;
