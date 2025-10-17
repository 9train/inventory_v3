export function buildCbRequestModal() {
  return {
    type: 'modal',
    callback_id: 'cbrequest_submit',
    title: { type: 'plain_text', text: 'Request Laptops' },
    submit: { type: 'plain_text', text: 'Submit' },
    close: { type: 'plain_text', text: 'Cancel' },
    blocks: [
      {
        type: 'input',
        block_id: 'room_block',
        label: { type: 'plain_text', text: 'Room number' },
        element: { type: 'plain_text_input', action_id: 'room' }
      },
      {
        type: 'input',
        block_id: 'start_block',
        label: { type: 'plain_text', text: 'Start time (HH:MM)' },
        element: { type: 'plain_text_input', action_id: 'start', placeholder: { type: 'plain_text', text: 'e.g., 10:15' } }
      },
      {
        type: 'input',
        block_id: 'end_block',
        label: { type: 'plain_text', text: 'End time (HH:MM)' },
        element: { type: 'plain_text_input', action_id: 'end', placeholder: { type: 'plain_text', text: 'e.g., 11:45' } }
      },
      {
        type: 'input',
        block_id: 'amount_block',
        label: { type: 'plain_text', text: 'Amount' },
        element: { type: 'plain_text_input', action_id: 'amount' }
      },
      {
        type: 'input',
        optional: true,
        block_id: 'notes_block',
        label: { type: 'plain_text', text: 'Notes (optional)' },
        element: { type: 'plain_text_input', action_id: 'notes' }
      }
    ]
  };
}
