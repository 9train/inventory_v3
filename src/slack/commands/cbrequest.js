import { logger as log } from '../../logger.js';
import { buildCbRequestModal } from '../views/cbrequestView.js';

export function registerCbRequest(app) {
  app.command('/cbrequest', async ({ ack, body, client, context }) => {
    const rid = context.rid;
    await ack();

    try {
      log.info('Slash /cbrequest', { rid, user: body.user_id });
      const view = buildCbRequestModal();
      await client.views.open({ trigger_id: body.trigger_id, view });
      log.info('Modal sent', { rid, kind: 'cbrequest' });
    } catch (err) {
      log.error('cbrequest failed', { rid, err: String(err && err.stack || err) });
    }
  });

  // Example: handle submission (auto-accept if capacity allows)
  app.view('cbrequest_submit', async ({ ack, body, view, client, context }) => {
    const rid = context.rid;
    await ack();

    try {
      const values = view.state.values;
      const room = values.room_block.room.value.trim();
      const start = values.start_block.start.value.trim();
      const end   = values.end_block.end.value.trim();
      const amount = Number(values.amount_block.amount.value.trim());
      const notes = (values.notes_block?.notes?.value || '').trim();

      log.info('Request received', { rid, room, start, end, amount });

      // TODO: implement capacity check + write to Sheet (append row)
      // For now, just confirm:
      await client.chat.postMessage({
        channel: body.user.id,
        text: `Request received for Room ${room}: ${amount} laptops from ${start}–${end}. (Notes: ${notes || '—'})`
      });
      log.info('Request confirmation sent', { rid });
    } catch (err) {
      log.error('cbrequest_submit failed', { rid, err: String(err && err.stack || err) });
    }
  });
}
