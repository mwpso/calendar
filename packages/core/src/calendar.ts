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
import { format as formatTz, utcToZonedTime } from 'date-fns-tz';

import ical from 'node-ical';

const url =
  'https://calendar.google.com/calendar/ical/c_bdgo9eg22l4eo0gsdf6lnnr358%40group.calendar.google.com/public/basic.ics?ctz=America%2FLos_Angeles';

// Let's start the school year on August 1st.
const currentYear = new Date().getFullYear();
const cutOffDate = new Date(currentYear, 7, 1);

export const YEAR_START =
  cutOffDate > new Date() ? new Date(currentYear - 1, 7, 1) : cutOffDate;
export const YEAR_END = new Date(currentYear + 1, 6, 31);

interface CalendarEvent {
  start: Date;
  title: string;
  location: string;
}

const formatDates = (events: CalendarEvent[]) => {
  const sortedEvents = events.sort((a, b) => compareAsc(a.start, b.start));
  return sortedEvents.map((event) => {
    return {
      ...event,
      dow: getDay(event.start),
      month: formatTz(event.start, 'MMMM', { timeZone: 'America/Los_Angeles' }),
      monthIdx: getMonth(event.start),
      start: event.start,
      shortDate: formatTz(event.start, 'M/d', {
        timeZone: 'America/Los_Angeles',
      }),
      weekOfMonth: getWeekOfMonth(event.start),
    };
  });
};

export const parseEvents = async () => {
  const events = await ical.async.fromURL(url);

  const yearsEvents = [];
  const rawEvents = [];

  for (const event of Object.values(events)) {
    if (event.type !== 'VEVENT') continue;
    const eventStart = event.start;
    if (!eventStart) continue;
    if (isBefore(eventStart, YEAR_START)) continue;
    if (isAfter(eventStart, YEAR_END)) continue;

    rawEvents.push({
      ...event,
      startTz: utcToZonedTime(event.start, 'America/Los_Angeles'),
    });

    yearsEvents.push({
      start:
        event.datetype === 'date'
          ? new Date(
              [event.start.toISOString().split('T')[0], '07:00:00.000Z'].join(
                'T'
              )
            )
          : utcToZonedTime(event.start, 'America/Los_Angeles'),
      dateType: event.datetype,
      title: event.summary,
      location: event.location,
    } as CalendarEvent);
  }

  return { formatted: formatDates(yearsEvents), raw: rawEvents };
};
