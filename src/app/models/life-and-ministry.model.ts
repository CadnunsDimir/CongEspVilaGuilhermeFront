export interface LifeAndMinistryWeek {
    id:                     string;
    weekLabel:              string;
    isCancelled:            boolean;
    bibleWeekReading:       string;
    openingSong:            number;
    president:              string;
    auxiliarRoomConductor:  string;
    openingPrayerBrother:   string;
    bibleTreasures:         Asignment;
    bibleReading:           Asignment;
    hiddenPearlsConductor:  string;
    becameBetterTeachers:   Asignment[];
    middleSong:             number;
    ourChristianLife:       Asignment[];
    congregationBibleStudy: Asignment;
    endingSong:             number;
    endingPrayerBrother:    string
}

export interface Asignment {
    title:       string;
    minutes:     number;
    brotherName: string;
    reader?:     string;
    auxiliarRoomBrotherName?: string
}