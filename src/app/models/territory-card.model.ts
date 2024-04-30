export interface TerritoryCard {
  cardId: number,
  neighborhood: string,
  directions: Direction[]
}

export interface Direction {
  long?: number
  lat?: number
  streetName: string,
  houseNumber: string,
  complementaryInfo: string
}
