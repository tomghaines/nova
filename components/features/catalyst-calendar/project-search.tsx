'use client';

import { useEffect, useMemo, useState } from 'react';
import { Command } from 'cmdk';
import type Token from '@/@types/data/catalyst-calendar/token';
import ImageWithFallback from '@/components/ui/image-with-fallback';
import placeholderLogo from '@/public/assets/missing-logo-placeholder.svg';

interface ProjectSearchProps {
  projects: string[];
  onSelect: (value: string) => void;
  value: string;
  tokenData: Record<string, Token>;
}

export function ProjectSearch({
  projects,
  onSelect,
  value,
  tokenData
}: ProjectSearchProps) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) =>
      project.toLowerCase().includes(search.toLowerCase())
    );
  }, [projects, search]);

  useEffect(() => {
    setSearch('');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!event.target) return;
      const target = event.target as HTMLElement;
      if (!target.closest('.command-menu')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='command-menu'>
      <Command className='w-full rounded-md border-[1px] border-gray-200 text-black dark:border-emerald-500 dark:bg-neutral-900 dark:text-neutral-400'>
        <Command.Input
          value={search}
          onValueChange={setSearch}
          onFocus={() => setIsOpen(true)}
          placeholder='Search projects...'
          className='w-full bg-transparent p-2 outline-none placeholder:text-sm'
        />
        {isOpen && (
          <Command.List className='absolute z-10 max-h-[200px] overflow-y-auto rounded-lg border-[1px] border-neutral-700 drop-shadow-xl dark:bg-neutral-900'>
            {filteredProjects.map((project) => {
              const token = Object.values(tokenData).find(
                (t) => t.symbol === project
              );

              return (
                <Command.Item
                  key={project}
                  value={project}
                  onSelect={(selected) => {
                    onSelect(selected);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className='flex cursor-pointer items-center gap-2 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                >
                  {token?.image_64 && (
                    <ImageWithFallback
                      height={18}
                      width={18}
                      src={token.image_64}
                      fallbackSrc={placeholderLogo}
                      alt={`${project} logo`}
                      className='rounded-full object-cover'
                    />
                  )}
                  {project}
                </Command.Item>
              );
            })}
          </Command.List>
        )}
      </Command>
    </div>
  );
}
