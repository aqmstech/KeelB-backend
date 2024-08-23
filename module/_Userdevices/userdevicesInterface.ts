export interface UserdevicesInterface {
  userId: string,
  deviceToken: string,
  deviceType: string,
  isDeleted?: boolean,
  createdAt: Date,
  updatedAt: Date
}