import { Api, StackContext, StaticSite } from 'sst/constructs';
import { YEAR_END, YEAR_START } from '@mwpso/core/src/calendar';

export function ApiStack({ stack }: StackContext) {
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
      VITE_APP_YEAR_START: String(YEAR_START.getFullYear()),
      VITE_APP_YEAR_END: String(YEAR_END.getFullYear()),
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
