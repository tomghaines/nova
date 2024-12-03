import * as React from 'react';
import { Check, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from '@/components/ui/command';
import { Popover } from '@radix-ui/themes';
import { Button } from '@/components/ui/button';

export interface ProjectSearchProps {
  projects: string[];
  onSelect: (value: string) => void;
  value: string;
}

export function ProjectSearch({
  projects,
  onSelect,
  value
}: ProjectSearchProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredProjects = projects.filter((project) =>
    project.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger className='hover:border-neutral-400 dark:border-emerald-500'>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-full justify-between border-[1px] dark:bg-neutral-900 dark:text-neutral-400'
        >
          {value || 'Search project...'}
          <Search className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </Popover.Trigger>
      <Popover.Content className='w-full p-0'>
        <Command
          shouldFilter={false}
          className='text-neutral-400 dark:bg-neutral-900'
        >
          <CommandInput
            placeholder='Search project...'
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandEmpty>No project found.</CommandEmpty>
          <CommandGroup className='max-h-[200px] overflow-y-auto'>
            {searchTerm &&
              filteredProjects.map((project) => (
                <CommandItem
                  key={project}
                  value={project}
                  className='cursor-pointer data-[selected=true]:bg-emerald-500 data-[selected=true]:text-white'
                  onSelect={(currentValue) => {
                    onSelect(currentValue === value ? '' : currentValue);
                    setOpen(false);
                    setSearchTerm('');
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === project ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {project}
                </CommandItem>
              ))}
          </CommandGroup>
        </Command>
      </Popover.Content>
    </Popover.Root>
  );
}
