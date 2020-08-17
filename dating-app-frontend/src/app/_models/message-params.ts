export interface MessageParams {
  page?: number;
  itemsPerPage?: number;
  messageContainer?: 'Outbox' | 'Inbox' | 'Unread';
}
