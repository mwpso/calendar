import { CalendarEvent, buildDates } from '@mwpso/core/src/dates';

function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}

interface Props {
  events: CalendarEvent[];
  month: string;
  monthIdx: number;
}

export const CalMonth = ({ events = [], month, monthIdx }: Props) => {
  const days = buildDates(events, month);

  return (
    <div
      className={classNames(
        'mt-4 md:grid md:grid-cols-2 md:h-64 md:divide-gray-200'
      )}
    >
      <div className="md:p-2">
        <div className="flex items-center text-center">
          <div className="flex-auto text-sm font-semibold text-gray-900">
            {month}
          </div>
        </div>
        <div className="mt-2 grid grid-cols-7 font-semibold text-center text-xs text-gray-700">
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
                  'mx-auto flex h-5 w-5 items-center justify-center rounded-full'
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
          'mt-12 md:mt-0 md:p-1'
        )}
      >
        <h2 className="text-base font-semibold text-gray-900">
          Schedule for {month}
        </h2>
        <ol className="mt-1 space-y-0 text-sm text-gray-500">
          {events.map((event, eventIdx) => (
            <li
              key={eventIdx}
              className="group flex items-center space-x-4 rounded-xl py-px px-0 focus-within:bg-gray-100 hover:bg-gray-100"
            >
              <div className="flex-auto">
                <p className="text-gray-900 text-xs">
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
