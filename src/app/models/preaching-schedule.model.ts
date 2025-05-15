export interface PreachingSchedule {
    fixedPreachingDays: PreachingScheduleDay[]
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