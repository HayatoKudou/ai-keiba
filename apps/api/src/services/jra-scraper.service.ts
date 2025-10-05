import { parseHTML } from 'linkedom'
import type { RaceInfo, HorseEntry, ScrapedRaceData } from '../types/race'

export class JraScraperService {
  /**
   * レース情報を取得
   */
  async scrapeRaceData(url: string): Promise<ScrapedRaceData> {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`)
    }

    const html = await response.text()
    const { document } = parseHTML(html)

    const race = this.extractRaceInfo(document)
    const entries = this.extractHorseEntries(document)

    return { race, entries }
  }

  /**
   * レース基本情報を抽出
   */
  private extractRaceInfo(document: Document): RaceInfo {
    const raceName = document.querySelector('.race-name, h1')?.textContent?.trim() || ''
    const raceDate = document.querySelector('.race-date')?.textContent?.trim() || ''
    const grade = document.querySelector('.grade')?.textContent?.trim()
    const place = document.querySelector('.place')?.textContent?.trim()

    return {
      name: raceName,
      date: raceDate,
      grade,
      place
    }
  }

  /**
   * 出馬表を抽出
   */
  private extractHorseEntries(document: Document): HorseEntry[] {
    const horseRows = document.querySelectorAll('.horse-item, tr.horse-row')

    return Array.from(horseRows).map(row => {
      const horseNumber = parseInt(
        row.querySelector('.horse-number')?.textContent?.trim() || '0'
      )
      const horseName = row.querySelector('.horse-name')?.textContent?.trim() || ''
      const jockeyName = row.querySelector('.jockey-name')?.textContent?.trim() || ''

      return {
        horseNumber,
        horseName,
        jockeyName
      }
    }).filter(entry => entry.horseNumber > 0)
  }
}
