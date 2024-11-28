'use client';

import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';

export function SwitchDemo({
  onThemeChange
}: {
  onThemeChange: (isNightMode: boolean) => void;
}) {
  const [isNightMode, setIsNightMode] = useState(false);

  const toggleTheme = () => {
    const newMode = !isNightMode;
    setIsNightMode(newMode);

    // Update document class and localStorage
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    onThemeChange(newMode);
  };

  return (
    <div className='flex items-center space-x-2'>
      {/* Dynamic text based on state */}
      <p className='p-2 text-gray-800 dark:text-gray-100'>
        {isNightMode ? 'Night Mode' : 'Day Mode'}
      </p>
      {/* Switch component with state toggle */}
      <Switch id='airplane-mode' onClick={() => toggleTheme()} />
    </div>
  );
}
