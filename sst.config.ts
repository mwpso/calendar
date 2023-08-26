import { SSTConfig } from 'sst';
import { ApiStack } from './stacks/api-stack';

export default {
  config(input) {
    return {
      name: 'mwpso',
      region: 'us-west-2',
      profile: 'wise',
    };
  },
  stacks(app) {
    app.stack(ApiStack);
  },
} satisfies SSTConfig;
