import ImageWithFallback from '../ui/image-with-fallback';
import placeholderLogo from '@/public/assets/missing-logo-placeholder.svg';
import type CalendarEvent from '@/@types/data/catalyst-calendar/calendar-event';
import type Token from '@/@types/data/catalyst-calendar/token';
import Link from 'next/link';

interface EventItemProps {
  event: CalendarEvent;
  token: Token;
}

export default function EventItem({ event, token }: EventItemProps) {
  return (
    <tr className='odd:bg-white even:bg-gray-50 dark:odd:bg-neutral-900 dark:even:bg-zinc-800'>
      <td className='p-2'>{event.date_start}</td>
      <td className='p-2'>{event.date_end}</td>
      <td className='p-2'>
        <div className='flex items-center gap-2'>
          <ImageWithFallback
            height={18}
            width={18}
            src={token.image_64 || token.image_32}
            fallbackSrc={placeholderLogo}
            alt={`${token.name} logo`}
            className='rounded-full object-cover'
          />
          {token.symbol}
        </div>
      </td>
      <td className='p-2'>Event Type</td>
      <td className='p-2'>{event.caption}</td>
      <td className='p-2'>
        <Link
          href={event.source}
          target='_blank'
          rel='noopener noreferrer'
          className='text-blue-600'
        >
          Source
        </Link>
      </td>
      <td className='p-2'>{event.date_public}</td>
    </tr>
  );
}
