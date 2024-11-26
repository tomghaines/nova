'use client';

import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';

export function SwitchDemo() {
  const [isNightMode, setIsNightMode] = useState(true);

  return (
    <div className='flex items-center space-x-2'>
      {/* Dynamic text based on state */}
      <p className='text-gray-800'>{isNightMode ? 'Night Mode' : 'Day Mode'}</p>
      {/* Switch component with state toggle */}
      <Switch
        id='airplane-mode'
        onClick={() => setIsNightMode((prev) => !prev)}
      />
    </div>
  );
}
