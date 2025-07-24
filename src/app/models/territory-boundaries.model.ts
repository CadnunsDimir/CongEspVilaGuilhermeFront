export interface Coordinate{
  latitude: string,
  longitude: string
}

export interface CongregationBoundaries{
  congregationName: string,
  bounariesCoordinates: Coordinate[]
  lastUpdate?: Date
}