import {
  addMonths,
  addYears,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  subDays,
} from 'date-fns';

import { format as formatTz } from 'date-fns-tz';

export interface CalendarEvent {
  location: string;
  month: string;
  shortDate: string;
  start: string;
  title: string;
}

export const cutOffDate = () => {
  const currentYear = new Date().getFullYear() - 1;
  // Let's start the school year calendar view on August 1st.
  const cutoffDay = 1;
  const cutOffMonth = 7; // August
  return new Date(currentYear, cutOffMonth, cutoffDay);
};

export const getMonths = () => {
  const months = [];
  for (let i = 0; i < 12; i++) {
    months.push(format(addMonths(cutOffDate(), i), 'MMMM'));
  }
  return months;
};

export const schoolYear = () => {
  const yearStart = cutOffDate();

  const start =
    yearStart > new Date()
      ? new Date(
          yearStart.getFullYear() - 1,
          yearStart.getMonth(),
          yearStart.getDate()
        )
      : yearStart;
  return {
    start,
    end: addYears(subDays(start, 1), 1),
  };
};

export const pacificOffset = '08:00:00.000Z';
export const timeZone = 'America/Los_Angeles';

export const hackPacificTime = (date: Date) => {
  return new Date([date.toISOString().split('T')[0], pacificOffset].join('T'));
};

export const buildDates = (events: CalendarEvent[], month: string) => {
  const monthIdx = getMonths().indexOf(month);
  // Example: If the school year starts in August, monthIdx 0 is August.
  // So, we need to add 7 to the monthIdx to get the correct month in Date.
  const dateMonth = monthIdx + cutOffDate().getMonth();
  const monthStart = startOfMonth(
    new Date(cutOffDate().getFullYear(), dateMonth, 1)
  );

  const dateRange = eachDayOfInterval({
    start: startOfWeek(monthStart),
    end: endOfWeek(endOfMonth(monthStart)),
  });

  return dateRange.map((date) => {
    const dayEvents = events.filter((event) => {
      return parseISO(event.start).getDate() === date.getDate();
    });

    return {
      date: date.toISOString().split('T')[0],
      day: date.getDate(),
      events: dayEvents,
      hasEvent: dayEvents.length > 0,
      isCurrentMonth: getMonth(date) === getMonth(monthStart),
      isToday:
        formatTz(date, 'yyyy-MM-dd', { timeZone }) ===
        formatTz(new Date(), 'yyyy-MM-dd', { timeZone }),
    };
  });
};
