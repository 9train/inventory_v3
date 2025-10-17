import { App, ExpressReceiver } from '@slack/bolt';
import express from 'express';
import { config, validateConfig } from '../config.js';
import { logger as log } from '../logger.js';
import { registerCbStatus } from './commands/cbstatus.js';
import { registerCbRequest } from './commands/cbrequest.js';

export function buildApp() {
  validateConfig();

  const receiver = new ExpressReceiver({
    signingSecret: config.slack.signingSecret,
    endpoints: '/slack/events'
  });

  // Wire JSON + HTTP access logs with request IDs
  receiver.router.use(express.json());
  receiver.router.use((req, res, next) => {
    const rid = req.headers['x-request-id'] || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    req._rid = rid;
    log.info('HTTP start', { rid, method: req.method, path: req.path });
    res.on('finish', () => {
      log.info('HTTP finish', { rid, status: res.statusCode });
    });
    next();
  });

  const app = new App({
    token: config.slack.botToken,
    appToken: config.slack.appToken,
    receiver
  });

  // Inject rid into Bolt context for precise logs
  app.use(async ({ context, next, body }) => {
    context.rid = body && (body.rid || body.trigger_id || body.event_id || body.view?.id) || `bolt-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    await next();
  });

  // Commands
  registerCbStatus(app);
  registerCbRequest(app);

  return { app, receiver };
}
