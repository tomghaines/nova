'use client';

import React from 'react';
import SentimentDashboard from '@/components/features/dashboard/sentiment_analysis/sentimentDashboard';
import { CoinProvider, useCoin } from '@/app/context/CoinContext';

export default function page() {
  return (
    <CoinProvider>
      <PageContent />
    </CoinProvider>
  );
}

export function PageContent() {
  const { selectedCoinSymbol } = useCoin();

  return (
    <div className='flex h-auto w-full items-center bg-[#101010] p-1'>
      <SentimentDashboard key={selectedCoinSymbol} />
    </div>
  );
}
