import React from 'react';
import { Button } from '@/components/ui/button';

interface NarrativeProps {
  label: string;
  backgroundColor: string;
}

const HotNarrative: React.FC<NarrativeProps> = ({ label, backgroundColor }) => {
  return (
    <div
      className='ml-4 mr-4 flex h-auto items-center justify-center rounded-full duration-700 hover:scale-105 hover:brightness-90'
      style={{ backgroundColor }}
    >
      <div className='flex items-center'>
        <h1 className='p-1 text-2xl font-bold invert'>{label}</h1>
        <Button variant='link' className='text-3xl invert'>
          →
        </Button>
      </div>
    </div>
  );
};

export default HotNarrative;
