import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { D1Database } from '@cloudflare/workers-types'

type Bindings = {
  keiba_db: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/*', cors({
  origin: ['http://localhost:5173'],
  credentials: true,
}));

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/api/races', async (c) => {
  const { results } = await c.env.keiba_db
  .prepare('SELECT * FROM races')
  .all();

return c.json({
  races: results
});
});

export default app
