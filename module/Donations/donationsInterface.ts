export interface DonationsInterface {
  donation_number?: string,
  donor_name: string,
  purpose: string,
  amount: number,
  user_id?: object,
  payment_method: string,
  payment_method_type: string,
  status?: string,
  payload?: any,
  createdAt: string,
  updatedAt?: string,
  deletedAt?: string
}