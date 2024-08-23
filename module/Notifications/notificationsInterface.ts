export interface NotificationsInterface {
  title: string,
  body: string,
  sender_id: string,
  receiver_id: string,
  topic: string,
  ref_id: string,
  is_read?: boolean,
  status?: boolean,
  type?: number,
  createdAt: string,
  updatedAt?: string,
  deletedAt?: string
}