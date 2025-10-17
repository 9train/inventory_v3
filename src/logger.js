import { randomUUID } from 'node:crypto';

const LEVELS = ['error', 'warn', 'info', 'debug'];
const envLevel = (process.env.LOG_LEVEL || 'info').toLowerCase();
const currentLevelIx = LEVELS.indexOf(envLevel) === -1 ? 2 : LEVELS.indexOf(envLevel);

const nowISO = () => new Date().toISOString();
const should = (lvl) => LEVELS.indexOf(lvl) <= currentLevelIx;

function out(level, msg, meta = {}) {
  // Always log to stdout as JSON for tailing on your platform
  const rec = { ts: nowISO(), level, msg, ...meta };
  // Avoid circulars
  try { process.stdout.write(JSON.stringify(rec) + '\n'); }
  catch { process.stdout.write(`{"ts":"${nowISO()}","level":"${level}","msg":${JSON.stringify(String(msg))}}\n`); }
}

export const logger = {
  error: (msg, meta) => should('error') && out('error', msg, meta),
  warn:  (msg, meta) => should('warn')  && out('warn',  msg, meta),
  info:  (msg, meta) => should('info')  && out('info',  msg, meta),
  debug: (msg, meta) => should('debug') && out('debug', msg, meta),
  mkReqId: () => randomUUID()
};
