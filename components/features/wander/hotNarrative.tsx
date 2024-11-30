import React from 'react';
import { Button } from '@/components/ui/button';

interface NarrativeProps {
  label: string;
}

const HotNarrative: React.FC<NarrativeProps> = ({ label }) => {
  return (
    <div className='ml-4 mr-4 flex h-auto items-center justify-center rounded-full border border-4 border-black duration-700 hover:scale-105 hover:brightness-90'>
      <h1 className='p-1 text-2xl font-bold'>{label}</h1>
      <Button variant='link' className='text-3xl'>
        →
      </Button>
    </div>
  );
};

export default HotNarrative;
