import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
  const response = await fetch('http://localhost:8787/api/races');
  const data = await response.json();
  return {
    races: data.races
  };
};