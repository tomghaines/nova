'use client';

import ParticleSystem from '@/components/features/home/particle';
import { useTheme } from '@/app/context/theme';
import Link from 'next/link';

export default function Home() {
  const { isNightMode } = useTheme();
  return (
    <div className='ml-20 flex w-full items-center'>
      <div className='left-24 mt-60 -translate-y-16 transform'>
        <p
          className={`mb-6 w-1/5 rounded-lg border border-black text-center text-black dark:invert`}
        >
          Analytics
        </p>
        <h1 className='mb-4 text-5xl leading-tight'>
          Your Real-time Lens into <br />
          Web3 Trends.
        </h1>
        <p className='mb-8 text-base font-thin leading-relaxed'>
          An AI-powered dashboard platform that real-time tracks <br />
          trending web3 topics on X Platform, providing insightful <br />
          analysis and interactive data visualizations <br />
        </p>
        <Link
          href='/dashboard'
          className='rounded bg-gray-300 px-48 py-2 font-semibold text-black transition-colors hover:bg-emerald-500'
        >
          Start Your Journey
        </Link>
      </div>

      <img
        src={isNightMode ? '/bg/bg-dark.png' : '/bg/bg-light.png'}
        className='absolute left-0 top-0 -z-10 h-full w-full object-cover'
        alt='Background'
      />
      <ParticleSystem />
    </div>
  );
}
