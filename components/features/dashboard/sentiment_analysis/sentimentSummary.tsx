import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

interface SentimentSummaryProps {
  coinData: {
    coin: string;
    totalScore: number;
    overallAnalysis: string;
  };
}

const SentimentSummary: React.FC<SentimentSummaryProps> = ({ coinData }) => {
  if (!coinData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className='relative h-full w-full rounded-lg border-[1px] border-neutral-900/40 bg-neutral-800/30 px-4 py-2'
    >
      <div className='flex h-full w-full flex-col justify-between gap-3'>
        <div className='flex w-full flex-col items-start justify-between'>
          <div className='flex w-full items-center justify-between space-y-1'>
            <div className='flex items-center gap-2'>
              <div className='flex items-center gap-1'>
                <span className='text-sm font-medium text-white/60'>
                  Overall Sentiment
                </span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className='flex items-center'>
                        <Sparkles className='h-3 w-3 text-blue-400/70' />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className='text-xs'>AI Generated Analysis</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <span
              className={`text-2xl font-bold tracking-tight ${
                coinData.totalScore >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {coinData.totalScore.toFixed(2)}
            </span>
          </div>

          <div className='space-y-2'>
            <div className='flex items-center gap-1'>
              <span className='text-xs font-medium text-white/40'>
                Analysis
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className='h-3 w-3 text-white/40' />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className='text-xs'>
                      Generated based on multiple market indicators
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className='h-full text-left text-xs font-light leading-relaxed text-white/70'>
              {coinData.overallAnalysis}
            </p>
          </div>
        </div>
        <div>
          <div className='mb-2 h-[1px] w-full bg-white/5' />
          <div className='flex items-center justify-between text-[10px] text-white/40'>
            <span>Updated just now</span>
            <span>AI Confidence: High</span>
          </div>{' '}
        </div>
      </div>
    </motion.div>
  );
};

export default SentimentSummary;
