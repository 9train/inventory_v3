import { buildApp } from './slack/app.js';
import { logger as log } from './logger.js';

const { app, receiver } = buildApp();

const port = process.env.PORT || 3000;
receiver.app.listen(port, () => {
  log.info('Server listening', { port });
  log.info('Health', { endpoint: '/slack/events' });
});
