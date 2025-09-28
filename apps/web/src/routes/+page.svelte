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

<button onclick={handleAnalysis}>
    分析
</button>