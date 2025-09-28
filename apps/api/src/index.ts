import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { D1Database } from '@cloudflare/workers-types'
import OpenAI from 'openai'
import { raceAnalysisPrompt, raceAnalysisJsonSchema } from './ai-schemas'

type Bindings = {
  keiba_db: D1Database
  OPENAI_API_KEY: string
  ALLOWED_ORIGINS: string
}

const app = new Hono<{ Bindings: Bindings }>()

// 手動でCORSヘッダーを設定
app.use('*', async (c, next) => {
  // プリフライトリクエストへの対応
  if (c.req.method === 'OPTIONS') {
    c.header('Access-Control-Allow-Origin', 'https://ai-keiba.pages.dev');
    c.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    c.header('Access-Control-Allow-Headers', 'Content-Type');
    c.header('Access-Control-Allow-Credentials', 'true');
    return c.text('', 204);
  }

  // 通常のリクエストへのCORSヘッダー設定
  c.header('Access-Control-Allow-Origin', 'https://ai-keiba.pages.dev');
  c.header('Access-Control-Allow-Credentials', 'true');

  await next();
});

app.get('/api/races', async (c) => {
  const { results } = await c.env.keiba_db
  .prepare('SELECT * FROM races')
  .all();

  return c.json({
    races: results
  });
});

app.post('/api/race-analysis', async (c) => {
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
