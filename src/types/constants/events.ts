export const EventTypes = {
  CLOSE_POPUP: 'CLOSEPOPUP_EVT',
  DELETE: 'DELETE_EVT',
  EXPORT: 'EXPORT_EVT',
  RELOAD_LAYOUT: 'RELOAD_LAYOUT_EVT',
  UPDATE: 'UPDATE_EVT'
} as const;

export type EventType = typeof EventTypes[keyof typeof EventTypes]; 