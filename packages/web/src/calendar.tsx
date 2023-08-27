import { useEffect, useRef, useState } from 'react';

import { CalMonth } from './components/cal-month';
import { PrinterIcon } from '@heroicons/react/20/solid';
import { groupBy } from 'lodash';
import logo from './assets/psologo.png';
import { useReactToPrint } from 'react-to-print';

const API_URL = import.meta.env.VITE_APP_API_URL;
const YEAR_START = import.meta.env.VITE_APP_YEAR_START;
const YEAR_END = import.meta.env.VITE_APP_YEAR_END;

const months = [
  'August',
  'September',
  'October',
  'November',
  'December',
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
];

export interface CalendarEvent {
  location: string;
  month: string;
  shortDate: string;
  start: string;
  title: string;
}

interface Events {
  [month: string]: CalendarEvent[];
}

export const Calendar = () => {
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const [events, setEvents] = useState<Events>();

  useEffect(() => {
    fetch(`${API_URL}/calendar`)
      .then((res) => res.json())
      .then((data) => setEvents(groupBy(data, 'month')));
  }, []);

  return (
    <div className="px-6 w-auto h-full" ref={componentRef}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg">
          <img src={logo} alt="logo" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl flex flex-row justify-center my-6">
          <span className="text-center font-extrabold text-xl">
            PSO Event Calendar {YEAR_START} to {YEAR_END}{' '}
            <button onClick={handlePrint}>
              <PrinterIcon className="text-sky-800 ml-2 inline-block w-4 h-4" />
            </button>
          </span>
        </div>
      </div>

      {events ? (
        <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
          {events && (
            <>
              <div>
                {months.slice(0, 6).map((month, monthIdx) => (
                  <div key={month}>
                    <CalMonth
                      events={events[month]}
                      month={month}
                      monthIdx={monthIdx}
                    />
                  </div>
                ))}
              </div>
              <div>
                {months.slice(6).map((month, monthIdx) => (
                  <div key={month}>
                    <CalMonth
                      events={events[month]}
                      month={month}
                      monthIdx={monthIdx + 6}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
