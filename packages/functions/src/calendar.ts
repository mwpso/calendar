import { ApiHandler } from 'sst/node/api';
import { Calendar } from '@mwpso/core/calendar';

export const yearly = ApiHandler(async (_evt) => {
  const events = await Calendar.parseEvents();

  return {
    statusCode: 200,
    body: JSON.stringify(events),
  };
});
