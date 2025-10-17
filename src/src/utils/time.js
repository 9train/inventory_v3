import { DateTime, Interval } from 'luxon';
import { config } from '../config.js';

export function nowTZ() {
  return DateTime.now().setZone(config.tz);
}

export function parseTimeRange(startStr, endStr) {
  // Accepts times like "10:00", "10:30", or ISO strings; returns ISO start/end
  const base = nowTZ().startOf('day');
  const start = DateTime.fromISO(startStr, { zone: config.tz }).isValid
    ? DateTime.fromISO(startStr, { zone: config.tz })
    : base.set({ hour: Number(startStr.split(':')[0] || 0), minute: Number(startStr.split(':')[1] || 0) });

  const end = DateTime.fromISO(endStr, { zone: config.tz }).isValid
    ? DateTime.fromISO(endStr, { zone: config.tz })
    : base.set({ hour: Number(endStr.split(':')[0] || 0), minute: Number(endStr.split(':')[1] || 0) });

  return { startISO: start.toISO(), endISO: end.toISO() };
}

export function formatRange(startISO, endISO) {
  const s = DateTime.fromISO(startISO).setZone(config.tz);
  const e = DateTime.fromISO(endISO).setZone(config.tz);
  return `${s.toFormat('h:mm a')}–${e.toFormat('h:mm a')}`;
}

export function weekdayName(dt = nowTZ()) {
  return dt.toFormat('cccc'); // e.g., "Wednesday"
}

export function currentTabName() {
  // Typical sheet per-day tab convention: "Wednesday", "Saturday"
  return weekdayName();
}

export function overlaps(aStartISO, aEndISO, bStartISO, bEndISO) {
  const A = Interval.fromDateTimes(
    DateTime.fromISO(aStartISO), DateTime.fromISO(aEndISO)
  );
  const B = Interval.fromDateTimes(
    DateTime.fromISO(bStartISO), DateTime.fromISO(bEndISO)
  );
  return A.overlaps(B);
}
