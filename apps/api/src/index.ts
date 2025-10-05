import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { D1Database } from '@cloudflare/workers-types'
import OpenAI from 'openai'
import { raceAnalysisPrompt, raceAnalysisJsonSchema } from './ai-schemas'
import { JraScraperService } from './services/jra-scraper.service'

type Bindings = {
  keiba_db: D1Database
  OPENAI_API_KEY: string
  ALLOWED_ORIGINS: string
}

const app = new Hono<{ Bindings: Bindings }>()
.use('/*', cors({
  origin: (origin, c) => {
    const allowedOrigins = c.env.ALLOWED_ORIGINS.split(',').map((o: string) => o.trim())

    return allowedOrigins.includes(origin) ? origin : null
  },
  credentials: true,
}))
.get('/api/races', async (c) => {
  const { results } = await c.env.keiba_db
  .prepare('SELECT * FROM races')
  .all();

  return c.json({
    races: results
  });
})
.post('/api/scrape-races', async (c) => {
  const scraper = new JraScraperService()
  const testUrl = 'https://www.jra.go.jp/JRADB/accessD.html?CNAME=pw01dde0108202503010120251004/A6'

  const scrapedData = await scraper.scrapeRaceData(testUrl)

  return c.json({
    success: true,
    data: scrapedData
  })
})
.post('/api/race-analysis', async (c) => {
  const { raceName } = await c.req.json();
  
  const openai = new OpenAI({
    apiKey: c.env.OPENAI_API_KEY,
  });
  const racePrompt = raceAnalysisPrompt(raceName);

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: racePrompt }],
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'race_analysis',
        strict: true,
        schema: raceAnalysisJsonSchema
      }
    }
  });

  const result = JSON.parse(completion.choices[0].message.content || '{}');
  
  return c.json(result);
});

export default app
