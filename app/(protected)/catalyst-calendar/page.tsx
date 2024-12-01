'use client';

import { Spinner } from '@/components/ui/spinner';
import { useCalendarList } from '@/hooks/api/use-calendar-list';
import CalendarEvent from '@/@types/data/catalyst-calendar';
import Image from 'next/image';
import { Table } from '@radix-ui/themes';
import { BsQuestionCircleFill } from 'react-icons/bs';

export default function CatalystCalendar() {
  const { events, tokenData, isLoading, error } = useCalendarList();

  if (isLoading) return <Spinner />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='flex flex-col space-y-4'>
      <h2 className='text-2xl font-bold'>Catalyst Calendar</h2>
      {events && events.length > 0 ? (
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Event Start Date</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Event End Date</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Project</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Event Type</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Description</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Source</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Ann. Date</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {events.map((event, index) => (
              <Table.Row key={index}>
                <Table.Cell>{event.date_start}</Table.Cell>
                <Table.Cell>{event.date_end}</Table.Cell>
                <Table.Cell>
                  <Image
                    height={18}
                    width={18}
                    src={tokenData[event.coin_id].image_64}
                    alt={`${index} logo`}
                  />
                </Table.Cell>
                <Table.Cell>Event Type</Table.Cell>
                <Table.Cell>{event.caption}</Table.Cell>
                <Table.Cell>{event.source}</Table.Cell>
                <Table.Cell>{event.date_public}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      ) : (
        <p>No events Found</p>
      )}
    </div>
  );
}
