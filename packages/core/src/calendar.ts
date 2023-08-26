export * as Calendar from './calendar';

import {
  compareAsc,
  format,
  getDay,
  getMonth,
  getWeekOfMonth,
  isAfter,
  isBefore,
} from 'date-fns';

import ical from 'node-ical';

const url =
  'https://calendar.google.com/calendar/ical/c_bdgo9eg22l4eo0gsdf6lnnr358%40group.calendar.google.com/public/basic.ics';

// Let's start the school year on August 1st.
const currentYear = new Date().getFullYear();
const cutOffDate = new Date(currentYear, 7, 1);

export const YEAR_START =
  cutOffDate > new Date() ? new Date(currentYear - 1, 7, 1) : cutOffDate;
export const YEAR_END = new Date(currentYear + 1, 6, 31);

interface CalendarEvent {
  start: ical.DateWithTimeZone;
  title: string;
  location: string;
}

const formatDates = (events: CalendarEvent[]) => {
  const sortedEvents = events.sort((a, b) => compareAsc(a.start, b.start));
  return sortedEvents.map((event) => {
    return {
      ...event,
      dow: getDay(event.start),
      month: format(event.start, 'MMMM'),
      monthIdx: getMonth(event.start),
      start: event.start,
      shortDate: format(event.start, 'M/d'),
      weekOfMonth: getWeekOfMonth(event.start),
    };
  });
};

export const parseEvents = async () => {
  const events = await ical.async.fromURL(url);

  const yearsEvents = [];

  for (const event of Object.values(events)) {
    if (event.type !== 'VEVENT') continue;
    const eventStart = event.start;
    if (!eventStart) continue;
    if (isBefore(eventStart, YEAR_START)) continue;
    if (isAfter(eventStart, YEAR_END)) continue;

    yearsEvents.push({
      start: eventStart,
      title: event.summary,
      location: event.location,
    } as CalendarEvent);
  }

  return formatDates(yearsEvents);
};
