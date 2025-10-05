export interface RaceInfo {
  name: string
  date: string
  grade?: string
  place?: string
  raceNumber?: number
  distance?: number
}

export interface HorseEntry {
  horseNumber: number
  horseName: string
  jockeyName: string
  frameNumber?: number
  weight?: number
}

export interface ScrapedRaceData {
  race: RaceInfo
  entries: HorseEntry[]
}

// netkeiba用の型定義
export interface RaceTrackInfo {
  name: string
  weather?: string
  turfCondition?: string
  dirtCondition?: string
  races: RaceBasicInfo[]
}

export interface RaceBasicInfo {
  raceId: string
  raceNumber: number
  raceName: string
  time: string
  surface: 'turf' | 'dirt' | 'obstacle' | 'unknown'
  distance: number
  horseCount: number
  grade?: string
}

export interface DailyRacesData {
  date: string
  tracks: RaceTrackInfo[]
}
