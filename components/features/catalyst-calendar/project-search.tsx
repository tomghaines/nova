'use client';

import { useEffect, useMemo, useState } from 'react';
import { Command } from 'cmdk';
import type Token from '@/@types/data/catalyst-calendar/token';
import ImageWithFallback from '@/components/ui/image-with-fallback';
import placeholderLogo from '@/public/assets/missing-logo-placeholder.svg';

interface ProjectSearchProps {
  projects: string[];
  onSelect: (values: Set<string>) => void;
  values: Set<string>;
  tokenData: Record<string, Token>;
}

export function ProjectSearch({
  projects,
  onSelect,
  values,
  tokenData
}: ProjectSearchProps) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredProjects = useMemo(() => {
    const filtered = projects.filter((project) =>
      project.toLowerCase().includes(search.toLowerCase())
    );

    // Sort by selected status
    return filtered.sort((a, b) => {
      if (values.has(a) && !values.has(b)) return -1;
      if (!values.has(a) && values.has(b)) return 1;
      return a.localeCompare(b);
    });
  }, [projects, search, values]);

  useEffect(() => {
    setSearch('');
  }, [values]);

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

  const handleSelect = (project: string) => {
    const newSelection = new Set(values);
    if (newSelection.has(project)) {
      newSelection.delete(project);
    } else {
      newSelection.add(project);
    }
    onSelect(newSelection);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className='command-menu w-full'>
      <Command className='rounded-md border-[1px] border-emerald-500 bg-transparent text-black dark:text-neutral-400'>
        <Command.Input
          value={search}
          onValueChange={setSearch}
          onFocus={() => setIsOpen(true)}
          placeholder='Search projects...'
          className='h-8 bg-transparent p-2 outline-none placeholder:text-sm placeholder:text-black dark:placeholder:text-neutral-400'
        />
        {isOpen && (
          <Command.List className='absolute z-10 max-h-[200px] overflow-y-auto rounded-lg border-[1px] border-neutral-400 bg-neutral-300 drop-shadow-xl dark:border-neutral-700 dark:bg-neutral-900'>
            {filteredProjects.map((project) => {
              const token = Object.values(tokenData).find(
                (t) => t.symbol === project
              );

              return (
                <Command.Item
                  key={project}
                  value={project}
                  onSelect={handleSelect}
                  className='flex cursor-pointer items-center gap-2 p-2 hover:bg-neutral-100 hover:text-black dark:hover:bg-emerald-500'
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
                  {values.has(project) && (
                    <span className='ml-auto text-emerald-500'>✓</span>
                  )}
                </Command.Item>
              );
            })}
          </Command.List>
        )}
      </Command>

      {values.size > 0 && (
        <div className='mt-2 flex flex-wrap gap-2'>
          {Array.from(values).map((project) => {
            const token = Object.values(tokenData).find(
              (t) => t.symbol === project
            );

            return (
              <div
                key={project}
                className='group flex items-center gap-1 rounded-md border border-emerald-500 bg-neutral-200 px-1 py-1 dark:bg-neutral-800'
              >
                {token?.image_64 && (
                  <ImageWithFallback
                    height={16}
                    width={16}
                    src={token.image_64}
                    fallbackSrc={placeholderLogo}
                    alt={`${project} logo`}
                    className='rounded-full object-cover'
                  />
                )}
                <span className='text-sm'>{project}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const newSelection = new Set(values);
                    newSelection.delete(project);
                    onSelect(newSelection);
                  }}
                  className='ml-1 text-gray-400 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-emerald-400'
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
