'use client';

import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';

export function SwitchDemo() {
  const [isNightMode, setIsNightMode] = useState(false);

  const toggleTheme = () => {
    setIsNightMode((prevMode) => !prevMode);
    if (isNightMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <div className='flex items-center space-x-2'>
      {/* Dynamic text based on state */}
      <p className='paragraph'>{isNightMode ? 'Night Mode' : 'Day Mode'}</p>
      {/* Switch component with state toggle */}
      <Switch
        id='airplane-mode'
        onClick={() => toggleTheme()}
      />
    </div>
  );
}
