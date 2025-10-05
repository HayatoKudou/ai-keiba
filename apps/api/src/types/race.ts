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
