import { nowTZ, parseTimeRange } from '../utils/time.js';
import { config } from '../config.js';

export function rowsToIntervals(rows) {
  // Map START/END text to ISO times at today’s date
  const todayISO = nowTZ().toISODate();
  return rows
    .filter(r => r.start && r.end && r.amount > 0)
    .map(r => {
      const { startISO, endISO } = parseTimeRange(r.start, r.end);
      return {
        ...r,
        day: todayISO,
        startISO,
        endISO
      };
    });
}

export function capacityForToday(weekday) {
  const w = weekday.toLowerCase();
  if (w === 'wednesday' && config.capacity.wednesday) return config.capacity.wednesday;
  if (w === 'saturday'  && config.capacity.saturday)  return config.capacity.saturday;
  return config.capacity.total;
}

export function availabilityNow(intervals, weekday) {
  const total = capacityForToday(weekday);
  const now = nowTZ().toISO();
  const active = intervals.filter(r => r.startISO <= now && r.endISO >= now);
  const used = active.reduce((sum, r) => sum + (r.amount || 0), 0);
  const available = Math.max(total - used, 0);

  const byRoom = new Map();
  for (const r of active) {
    const key = r.room || 'Unknown';
    const cur = byRoom.get(key) || { room: key, total: 0, windows: [] };
    cur.total += r.amount;
    cur.windows.push([r.startISO, r.endISO]);
    byRoom.set(key, cur);
  }
  return { total, available, used, rooms: Array.from(byRoom.values()) };
}

export function remainingTodayByRoom(intervals) {
  const now = nowTZ().toISO();
  const remaining = intervals.filter(r => r.endISO > now);
  const byRoom = new Map();
  for (const r of remaining) {
    const key = r.room || 'Unknown';
    const cur = byRoom.get(key) || { room: key, total: 0, windows: [] };
    cur.total += r.amount;
    cur.windows.push([r.startISO, r.endISO]);
    byRoom.set(key, cur);
  }
  return Array.from(byRoom.values());
}
