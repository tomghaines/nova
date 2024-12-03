import Link from 'next/link';
import ImageWithFallback from '../../ui/image-with-fallback';
import placeholderLogo from '@/public/assets/missing-logo-placeholder.svg';
import { FaLink } from 'react-icons/fa';
import { Badge } from '@radix-ui/themes';
import { eventTypeToColor } from '@/@types/data/catalyst-calendar/event-badge-colors';
import type CalendarEvent from '@/@types/data/catalyst-calendar/calendar-event';
import type Token from '@/@types/data/catalyst-calendar/token';

interface EventItemProps {
  event: CalendarEvent;
  token: Token;
}

export default function EventItem({ event, token }: EventItemProps) {
  return (
    <tr className='odd:bg-white even:bg-gray-100 dark:odd:bg-neutral-900 dark:even:bg-neutral-800'>
      <td className='w-[110px] whitespace-nowrap px-2 py-1'>
        {event.date_start}
      </td>
      <td className='w-[110px] whitespace-nowrap px-2 py-1'>
        {event.date_end}
      </td>
      <td className='w-[100px] whitespace-nowrap px-2 py-1'>
        <div className='flex items-center gap-2'>
          <ImageWithFallback
            height={18}
            width={18}
            src={token?.image_64 || token?.image_32 || placeholderLogo}
            fallbackSrc={placeholderLogo}
            alt={`${token?.name} logo`}
            className='rounded-full object-cover'
          />
          <span className='truncate'>{token?.symbol}</span>
        </div>
      </td>
      <td className='w-[120px] whitespace-nowrap px-2 py-1'>
        <Badge
          className='max-w-full truncate rounded-md px-1'
          color={
            eventTypeToColor[
              event.eventType as keyof typeof eventTypeToColor
            ] || 'indigo'
          }
        >
          {event.eventType}
        </Badge>
      </td>
      <td className='w-[250px] px-2 py-1'>
        <div className='truncate'>{event.caption}</div>
      </td>
      <td className='w-[90px] whitespace-nowrap px-2 py-1'>
        <Link
          href={event.source}
          target='_blank'
          rel='noopener noreferrer'
          className='flex items-center gap-2 hover:text-neutral-600 dark:hover:text-neutral-300'
        >
          <FaLink className='text-emerald-500 hover:text-emerald-300' /> Source
        </Link>
      </td>
      <td className='w-[110px] whitespace-nowrap px-2 py-1'>
        {event.date_public}
      </td>
    </tr>
  );
}
