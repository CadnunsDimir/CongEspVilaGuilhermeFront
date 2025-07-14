export interface WeekendMeeting {
  date: string
  president: string
  speaker: any
  speakerCongregation: any
  publicTalkTheme: any
  outlineNumber: number
  watchtowerStudyConductor: string
  watchtowerStudyReader: string
}

export interface WeekendMeetingMonth {
  month: string,
  weeks: WeekendMeeting[]
}

export interface PublicTalk {
  date: string,
  speaker: string,
  publicTalkTheme: string,
  outlineNumber: number,
  isLocal: boolean,
  congregation: string
}

export interface AllowedBrothersOnWeekend{ 
  asPresident: string[], 
  asReader: string[]
}