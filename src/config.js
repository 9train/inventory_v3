import 'dotenv/config';

function getJSONFromEnv(name, fallback = null) {
  const v = process.env[name];
  if (!v) return fallback;
  try { return JSON.parse(v); } catch { return fallback; }
}

export const config = {
  slack: {
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    botToken: process.env.SLACK_BOT_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN
  },
  sheets: {
    id: process.env.SHEET_ID,
    serviceAccountPath: process.env.GOOGLE_SERVICE_ACCOUNT_JSON_PATH || null,
    serviceAccountInline: getJSONFromEnv('GOOGLE_SERVICE_ACCOUNT_JSON', null)
  },
  tz: process.env.TZ || 'America/New_York',
  capacity: {
    wednesday: Number(process.env.WEDNESDAY_TOTAL || 0) || null,
    saturday: Number(process.env.SATURDAY_TOTAL || 0) || null,
    total: Number(process.env.TOTAL_LAPTOPS || 0) || 90
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info'
  }
};

function requireEnv(name) {
  if (!process.env[name] || String(process.env[name]).trim() === '') {
    throw new Error(`Missing required env var: ${name}`);
  }
}

export function validateConfig() {
  requireEnv('SLACK_SIGNING_SECRET');
  requireEnv('SLACK_BOT_TOKEN');
  requireEnv('SLACK_APP_TOKEN');
  requireEnv('SHEET_ID');
}
