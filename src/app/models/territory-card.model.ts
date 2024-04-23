export interface TerritoryCard {
  cardId: number,
  neighborhood: string,
  directions: Direction[]
}

export interface Direction {
  streetName: string,
  houseNumber: string,
  complementaryInfo: string
}
