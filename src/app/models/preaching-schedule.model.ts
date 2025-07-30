export interface PreachingSchedule {
    specialDays: SpecialPreachingDay[],
    fixedPreachingDays: PreachingScheduleDay[]
}

export interface SpecialPreachingDay {
    date: string;
    hour: string;
    fieldOverseer: string;
    place: {
        name: string;
        adress: string;
    };
}

export interface PreachingScheduleDay {
    dayOfWeek: number,
    hour: string,
    fieldOverseer: string,
    place: {
        name: string,
        adress: string
    }
}