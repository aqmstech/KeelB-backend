export interface CategoriesInterface {
  name: string,
  image: string,
  parent_id?: string,
  status: boolean,
  type?: string,
  isFeatured?: boolean,
  createdAt: string,
  updatedAt?: string,
  deletedAt?: string
}