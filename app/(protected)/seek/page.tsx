'use client';

import { MindshareMap } from '@/components/features/dashboard/mindshareMap';
import { SearchBar } from '@/components/features/dashboard/command';
import { SkeletonBar } from '@/components/features/dashboard/skeleton';
import SentimentLayout from '@/components/features/seek/sentimentLayout';
import MindshareLayout from '@/components/features/seek/mindshareLayout';
import React from 'react';

export default function page() {
  return (
    <div className='flex w-full flex-col items-center justify-start'>
      {/* Inner Container for Charts and Search */}
      <div className='w-full max-w-5xl px-6 text-center'>
        {/* Search Bar */}
        <div className='relative mb-12 mt-12'>
          <SearchBar />
        </div>

        {/* AI-Summary */}
        <div className='AI-Summary'></div>

        {/* Sentiment Layout Section */}
        <SentimentLayout />

        {/* Mindshare Map Section */}
        <MindshareLayout />
      </div>
    </div>
  );
}
