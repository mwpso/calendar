import { Api, StackContext, StaticSite } from 'sst/constructs';

import { schoolYear } from '@mwpso/core/src/dates';

export function ApiStack({ stack }: StackContext) {
  const { start, end } = schoolYear();
  const api = new Api(stack, 'api', {
    routes: {
      'GET /calendar': 'packages/functions/src/calendar.yearly',
      'GET /debug': 'packages/functions/src/calendar.yearlyDebug',
    },
  });

  new StaticSite(stack, 'web', {
    path: 'packages/web',
    buildOutput: 'dist',
    buildCommand: 'npm run build',
    environment: {
      VITE_APP_API_URL: api.url,
      VITE_APP_YEAR_START: String(start.getFullYear()),
      VITE_APP_YEAR_END: String(end.getFullYear()),
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
