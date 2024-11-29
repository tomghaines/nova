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
    <div className='flex items-center space-x-2'>
      {/* Dynamic text based on state */}
      <p className='text-gray-800 dark:text-gray-100'>
        {isNightMode ? 'Night Mode' : 'Day Mode'}
      </p>
      {/* Switch component with state toggle */}
      <Switch id='airplane-mode' onClick={onThemeToggle} />
    </div>
  );
}
