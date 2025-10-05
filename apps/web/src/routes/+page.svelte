<script lang="ts">
  import type { PageData } from './$types';
  import { PUBLIC_API_URL } from '$env/static/public';

  const props = $props<{ data: PageData }>();
  const { data } = props;

const handleAnalysis = () => {
  fetch(`${PUBLIC_API_URL}/api/race-analysis`, {
    method: 'POST',
    body: JSON.stringify({ raceName: 'スプリンターズＳ' })
  })
  .then(response => response.json())
  .then(data => console.log('AI Response:', data));
}

const handleScrape = () => {
  fetch(`${PUBLIC_API_URL}/api/scrape-races`, {
    method: 'POST'
  })
  .then(response => response.json())
  .then(data => console.log('Scrape Response:', data));
}

</script>

{#each data.races as race}
    <div>
        <h2>{race.name}</h2>
        <p>{race.date}</p>
        <p>{race.grade}</p>
        <p>{race.place}</p>
        <p>{race.distance}</p>
    </div>
{/each}

<button onclick={handleScrape}>
    分析
</button>