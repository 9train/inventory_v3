import { formatRange } from '../../utils/time.js';

export function buildCbStatusModal({ weekday, total, available, used, activeRooms, remaining }) {
  const activeLines = activeRooms.length
    ? activeRooms.map(r => `• *Room ${r.room}* — ${r.total} (${r.windows.map(([s,e]) => formatRange(s,e)).join(', ')})`).join('\n')
    : '_No rooms are using Chromebooks right now._';

  const remainingLines = remaining.length
    ? remaining.map(r => `• *Room ${r.room}* — ${r.total} (later today: ${r.windows.map(([s,e]) => formatRange(s,e)).join(', ')})`).join('\n')
    : '_No remaining pickups today._';

  return {
    type: 'modal',
    title: { type: 'plain_text', text: 'Chromebook Status' },
    close: { type: 'plain_text', text: 'Close' },
    blocks: [
      {
        type: 'section',
        text: { type: 'mrkdwn', text: `*${weekday}*\n*Available now:* ${available}/${total}  _(in use: ${used})_` }
      },
      { type: 'divider' },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: `*Rooms using Chromebooks now:*\n${activeLines}` }
      },
      { type: 'divider' },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: `*Remaining today (pickups later):*\n${remainingLines}` }
      }
    ]
  };
}
