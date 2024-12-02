'use client';

import React from 'react';
import { Switch } from '@/components/ui/switch';

export function SwitchMode({
  isNightMode,
  onThemeToggle
}: {
  isNightMode: boolean;
  onThemeToggle: () => void;
}) {
  return (
    <div className='flex items-center space-x-4'>
      {/* Dynamic text based on state */}
      <p className='text-xl text-gray-800 dark:text-gray-100'>
        {isNightMode ? 'DARK' : 'LIGHT'}
      </p>
      {/* Switch component with state toggle */}
      <Switch onClick={onThemeToggle} />
    </div>
  );
}
