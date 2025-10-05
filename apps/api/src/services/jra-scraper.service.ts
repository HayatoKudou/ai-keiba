import { parseHTML } from 'linkedom'
import type { RaceTrackInfo, RaceBasicInfo, DailyRacesData } from '../types/race'

export class JraScraperService {
  private readonly USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'

  async scrapeDailyRaces(url: string): Promise<DailyRacesData> {
    const response = await fetch(url, {
      headers: { 'User-Agent': this.USER_AGENT }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`)
    }

    // EUC-JPデコード
    const buffer = await response.arrayBuffer()
    const decoder = new TextDecoder('euc-jp')
    const html = decoder.decode(buffer)

    const { document } = parseHTML(html)
    return this.extractDailyRaces(document)
  }

  private extractDailyRaces(document: Document): DailyRacesData {
    console.log(document)
    const tracks: RaceTrackInfo[] = []
    const trackElements = document.querySelectorAll('dl.RaceList_DataList')

    trackElements.forEach(trackEl => {
      const header = trackEl.querySelector('dt.RaceList_DataHeader')

      // 競馬場名抽出 (例: "4回 東京 2日目" → "東京")
      const titleText = header?.querySelector('p.RaceList_DataTitle')?.textContent || ''
      const trackName = this.extractTrackName(titleText)

      // 天気アイコンクラスから天気を取得
      const weatherIcon = header?.querySelector('span.Icon_Weather')?.className || ''
      const weather = this.extractWeather(weatherIcon)

      // 馬場状態
      const turfText = header?.querySelector('span.Shiba')?.textContent || ''
      const dirtText = header?.querySelector('span.Da')?.textContent || ''
      const turfCondition = turfText.replace('芝(A)：', '').replace('芝：', '').trim()
      const dirtCondition = dirtText.replace('ダ：', '').trim()

      // レース情報
      const raceElements = trackEl.querySelectorAll('li.RaceList_DataItem')
      const races: RaceBasicInfo[] = Array.from(raceElements).map(raceEl => {
        const link = raceEl.querySelector('a[href*="race_id"]')?.getAttribute('href') || ''
        const raceId = this.extractRaceId(link)

        const raceNumText = raceEl.querySelector('div.Race_Num')?.textContent?.trim() || ''
        const raceNumber = parseInt(raceNumText.replace('R', ''))

        const raceName = raceEl.querySelector('span.ItemTitle')?.textContent?.trim() || ''
        const time = raceEl.querySelector('span.RaceList_Itemtime')?.textContent?.trim() || ''

        const distanceEl = raceEl.querySelector('span.RaceList_ItemLong, span[class=""]')
        const distanceText = distanceEl?.textContent?.trim() || ''
        const surface = this.extractSurface(distanceEl?.className || '', distanceText)
        const distance = parseInt(distanceText.match(/\d+/)?.[0] || '0')

        const horseCountText = raceEl.querySelector('span.RaceList_Itemnumber')?.textContent?.trim() || ''
        const horseCount = parseInt(horseCountText.replace('頭', ''))

        const gradeIcon = raceEl.querySelector('span.Icon_GradeType')?.className || ''
        const grade = this.extractGrade(gradeIcon)

        return {
          raceId,
          raceNumber,
          raceName,
          time,
          surface,
          distance,
          horseCount,
          grade
        }
      })

      tracks.push({
        name: trackName,
        weather,
        turfCondition: turfCondition || undefined,
        dirtCondition: dirtCondition || undefined,
        races
      })
    })

    return {
      date: new Date().toISOString().split('T')[0],
      tracks
    }
  }

  private extractTrackName(text: string): string {
    // "4回 東京 2日目" から「東京」を抽出
    const match = text.match(/\d+回\s*(.+?)\s*\d+日目/)
    return match?.[1] || text.trim()
  }

  private extractWeather(className: string): string {
    // Weather01=晴, Weather02=曇, Weather03=雨 など
    if (className.includes('Weather01')) return '晴'
    if (className.includes('Weather02')) return '曇'
    if (className.includes('Weather03')) return '雨'
    if (className.includes('Weather04')) return '雪'
    return '不明'
  }

  private extractSurface(className: string, text: string): 'turf' | 'dirt' | 'obstacle' | 'unknown' {
    if (className.includes('Turf') || text.includes('芝')) return 'turf'
    if (className.includes('Dart') || text.includes('ダ')) return 'dirt'
    if (text.includes('障')) return 'obstacle'
    return 'unknown'
  }

  private extractGrade(className: string): string | undefined {
    if (className.includes('Icon_GradeType1')) return 'G1'
    if (className.includes('Icon_GradeType2')) return 'G2'
    if (className.includes('Icon_GradeType3')) return 'G3'
    if (className.includes('Icon_GradeType5')) return 'L' // リステッド
    return undefined
  }

  private extractRaceId(href: string): string {
    const match = href.match(/race_id=(\d+)/)
    return match?.[1] || ''
  }
}
