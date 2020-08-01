import {
  TRANSACTION_STATUS,
  ENTITY_STATUS
} from '../../constants/GlobalConstants';

export function statusLabel(type = 'trans' | 'person', text) {
  const style = { fontWeight: '700', cursor: 'pointer' };
  const status =
    type === 'trans' ? TRANSACTION_STATUS[text] : ENTITY_STATUS[text];
  let label = 'Other';
  if (status) {
    label = status.label;
    style.color = status.color;
  }

  return [label, style];
}
