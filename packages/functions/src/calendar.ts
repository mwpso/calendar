import { ApiHandler } from 'sst/node/api';
import { Calendar } from '@mwpso/core/calendar';

export const yearly = ApiHandler(async (_evt) => {
  const { formatted } = await Calendar.parseEvents();

  return {
    statusCode: 200,
    body: JSON.stringify(formatted),
  };
});

export const yearlyDebug = ApiHandler(async (_evt) => {
  const { raw } = await Calendar.parseEvents();

  return {
    statusCode: 200,
    body: JSON.stringify(raw),
  };
});
