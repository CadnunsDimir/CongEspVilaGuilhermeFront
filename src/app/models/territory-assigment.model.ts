export interface TerritoryAssignmentSheet {
    serviceYear: number,
    totalPages: number,
    itensPerPage: number,
    numbers: TerritoryAssignmentSheetCard[]
}

export interface TerritoryAssignmentSheetCard {
    number: number,
    lastDate: Date | undefined,
    records: {
        recordId: number,
        assignedTo: string;
        assignedDate: Date;
        completedDate: Date | undefined;
    }[]
}

export interface NewTerritoryAssignmentRecord{
    territoryNumber : number,
    assignedTo : string,
    assignedDate : Date,
    completedDate: Date | undefined
}

export interface TerritoryAssignmentPatchRecord{ 
    recordId: any; 
    completedDate: any; 
}