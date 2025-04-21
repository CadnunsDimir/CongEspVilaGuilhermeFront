export interface TerritoryMapMarker{
    cardId: number,
    orderPosition: number,
    lat: number,
    long: number
}


export interface FullMap{
    mapMarkers: TerritoryMapMarker[],
    totalAdresses: number,
    checkCoordinatesOnCards: number[]
}