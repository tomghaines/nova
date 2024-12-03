import React from 'react';
import { Button } from '@/components/ui/button';

interface NarrativeProps {
  label: string;
}

const HotNarrative: React.FC<NarrativeProps> = ({ label }) => {
  return (
    <div className='ml-4 mr-4 flex h-auto items-center justify-center rounded-full border border-gray-200 text-gray-600 duration-700 hover:scale-105 dark:border-neutral-400 dark:text-neutral-400'>
      <div className='flex items-center'>
        <h1 className='p-1 text-lg font-semibold'>{label}</h1>
        <Button
          variant='link'
          className='text-3xl text-gray-600 dark:text-neutral-400'
        >
          →
        </Button>
      </div>
    </div>
  );
};

export default HotNarrative;
