import { google } from 'googleapis';
import fs from 'node:fs';
import { config } from '../config.js';
import { logger as log } from '../logger.js';
import { DateTime } from 'luxon';

function buildJWT() {
  if (config.sheets.serviceAccountInline) {
    return new google.auth.JWT(
      config.sheets.serviceAccountInline.client_email,
      null,
      config.sheets.serviceAccountInline.private_key,
      ['https://www.googleapis.com/auth/spreadsheets.readonly']
    );
  }
  const path = config.sheets.serviceAccountPath;
  const raw = JSON.parse(fs.readFileSync(path, 'utf8'));
  return new google.auth.JWT(
    raw.client_email,
    null,
    raw.private_key,
    ['https://www.googleapis.com/auth/spreadsheets.readonly']
  );
}

export async function fetchRowsForTab(tabName) {
  const jwt = buildJWT();
  const sheets = google.sheets({ version: 'v4', auth: jwt });

  // Expected columns: START | END | ROOM | AMOUNT | NOTES
  const range = `'${tabName}'!A:E`;
  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: config.sheets.id,
    range
  });

  const rows = (data.values || []).slice(1) // skip header
    .map((r, idx) => {
      const [start, end, room, amount, notes] = r;
      return {
        rowIndex: idx + 2,
        start: (start || '').trim(),
        end: (end || '').trim(),
        room: (room || '').trim(),
        amount: Number(amount || 0),
        notes: (notes || '').trim()
      };
    });

  log.debug('Sheets fetched', { tabName, count: rows.length, ts: DateTime.now().toISO() });
  return rows;
}
