export interface CityInterface {
  countryId: string,
  regionId: string,
  subRegionId: string,
  stateId: string,
  name: string,
  population: number,
  createdAt: Date,
  updatedAt?: Date
}