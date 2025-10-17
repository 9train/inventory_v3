import { logger as log } from '../../logger.js';
import { currentTabName } from '../../utils/time.js';
import { fetchRowsForTab } from '../../services/sheets.js';
import { rowsToIntervals, availabilityNow, remainingTodayByRoom } from '../../services/inventory.js';
import { buildCbStatusModal } from '../views/cbstatusView.js';

export function registerCbStatus(app) {
  app.command('/cbstatus', async ({ ack, body, client, context }) => {
    const rid = context.rid;
    await ack(); // always ack fast

    try {
      log.info('Slash /cbstatus', { rid, user: body.user_id });

      const tab = currentTabName();
      const rows = await fetchRowsForTab(tab);
      const intervals = rowsToIntervals(rows);
      const now = availabilityNow(intervals, tab);
      const remaining = remainingTodayByRoom(intervals);

      const view = buildCbStatusModal({
        weekday: tab,
        total: now.total,
        available: now.available,
        used: now.used,
        activeRooms: now.rooms,
        remaining
      });

      await client.views.open({ trigger_id: body.trigger_id, view });
      log.info('Modal sent', { rid, kind: 'cbstatus' });
    } catch (err) {
      log.error('cbstatus failed', { rid, err: String(err && err.stack || err) });
      try {
        await client.chat.postEphemeral({
          channel: body.channel_id,
          user: body.user_id,
          text: 'Sorry—could not open the status modal. Check logs.'
        });
      } catch {}
    }
  });
}
