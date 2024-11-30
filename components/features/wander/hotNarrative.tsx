import React from 'react';

interface NarrativeProps {
  label: string;
}

const HotNarrative: React.FC<NarrativeProps> = ({ label }) => {
  return (
    <div className='ml-3 mr-3 flex h-auto items-center justify-center rounded-full border border-4 border-black duration-700 hover:scale-105 hover:brightness-90'>
      <h1 className='p-1 text-2xl font-bold'>{label}</h1>
    </div>
  );
};

export default HotNarrative;
