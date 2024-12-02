export default interface CalendarEvent {
  caption: string;
  source: string;
  source_reliable: boolean | string;
  important: boolean | string;
  date_public: string;
  date_start: string;
  date_end: string;
  coin_id: stirng;
  coin_price_changes: string;
  tags: string;
}
