export interface RestaurantsInterface {
  name: string,
  cover_image: string,
  image: string,
  description: string,
  address?: string,
  user_id?: string,
  min_price: number,
  max_price: number,
  avg_rating?: number,
  menu?: any,
  currency_type: string,
  location: any,
  cuisines?: [],
  meal_type?: [],
  ambiance?: [],
  categories?: [],
  timings?: [],
  areas?: [],
  dinning_options?: [],
  types?: [],
  accepted_payment_types?: string,
  service_types?: string,
  service_time?: any,
  isFeatured?: boolean,
  isVerified?: boolean,
  status?: string,
  createdAt: string,
  updatedAt?: string,
  deletedAt?: string
}