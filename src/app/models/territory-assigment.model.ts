export interface TerritoryAssignmentSheet {
    serviceYear: number,
    totalPages: number,
    itensPerPage: number,
    lastCompletedDate: {
        [key: string]: string
    },
    numbers: TerritoryAssignmentSheetCard[]
}

export interface TerritoryAssignmentRecord {
    recordId: number,
    assignedTo: string;
    assignedDate: Date;
    completedDate: Date | undefined;
}

export interface TerritoryAssignmentSheetCard {
    number: number,
    lastDate: string | undefined,
    editLastDate?: boolean,
    records: TerritoryAssignmentRecord[]
}

export interface NewTerritoryAssignmentRecord {
    territoryNumber: number,
    assignedTo: string,
    assignedDate: Date,
    completedDate: Date | undefined
}

export interface TerritoryAssignmentPatchRecord {
    recordId: any;
    completedDate: any;
}