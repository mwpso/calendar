import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  getMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
} from 'date-fns';

import { CalendarEvent } from '../calendar';

function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}

interface Props {
  events: CalendarEvent[];
  month: string;
  monthIdx: number;
}

const buildDates = (events: CalendarEvent[], monthIdx: number) => {
  // School year starts in August. monthIdx 0 is August.
  // So, we need to add 7 to the monthIdx to get the correct month in Date.
  const dateMonth = monthIdx + 7;
  const monthStart = startOfMonth(new Date(2023, dateMonth, 1));
  const monthEnd = endOfMonth(monthStart);
  const weekStart = startOfWeek(monthStart);
  const weekEnd = endOfWeek(monthEnd);
  const dateRange = eachDayOfInterval({ start: weekStart, end: weekEnd });
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
        date.toISOString().split('T')[0] ===
        new Date().toISOString().split('T')[0],
    };
  });
};

export const CalMonth = ({ events = [], month, monthIdx }: Props) => {
  const days = buildDates(events, monthIdx);

  return (
    <div
      className={classNames(
        'mt-8 md:grid md:grid-cols-2 md:h-80 md:divide-gray-200'
      )}
    >
      <div className="md:p-2">
        <div className="flex items-center text-center">
          <div className="flex-auto text-sm font-semibold text-gray-900">
            {month}
          </div>
        </div>
        <div className="mt-2 grid grid-cols-7 font-semibold text-center text-xs leading-6 text-gray-700">
          <div>S</div>
          <div>M</div>
          <div>T</div>
          <div>W</div>
          <div>T</div>
          <div>F</div>
          <div>S</div>
        </div>
        <div className="mt-1 grid grid-cols-7 text-sm">
          {days.map((day, dayIdx) => (
            <div
              key={day.date}
              className={classNames(
                dayIdx > 6 && 'border-t border-gray-200',
                'py-2'
              )}
            >
              <button
                type="button"
                className={classNames(
                  day.hasEvent && 'text-white',
                  !day.hasEvent && day.isToday && 'text-amber-500',
                  !day.hasEvent &&
                    !day.isToday &&
                    day.isCurrentMonth &&
                    'text-gray-900',

                  !day.isToday && !day.isCurrentMonth && 'text-gray-400',
                  day.hasEvent &&
                    day.isCurrentMonth &&
                    day.isToday &&
                    'bg-amber-500',
                  day.hasEvent &&
                    day.isCurrentMonth &&
                    !day.isToday &&
                    'bg-sky-300',
                  !day.hasEvent && 'hover:bg-sky-100',
                  (day.hasEvent || day.isToday) && 'font-semibold',
                  'mx-auto flex h-8 w-8 items-center justify-center rounded-full'
                )}
              >
                <time dateTime={day.date}>{day.isCurrentMonth && day.day}</time>
              </button>
            </div>
          ))}
        </div>
      </div>
      <section
        className={classNames(
          monthIdx < 6 && '-order-1 text-right',
          'mt-12 md:mt-0 md:p-2'
        )}
      >
        <h2 className="text-base font-semibold leading-6 text-gray-900">
          Schedule for {month}
        </h2>
        <ol className="mt-1 space-y-0 text-sm leading-6 text-gray-500">
          {events.map((event, eventIdx) => (
            <li
              key={eventIdx}
              className="group flex items-center space-x-4 rounded-xl px-4 py-0 focus-within:bg-gray-100 hover:bg-gray-100"
            >
              <div className="flex-auto">
                <p className="text-gray-900">
                  <span className="font-semibold">{event.shortDate}</span>{' '}
                  {event.title}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
};
