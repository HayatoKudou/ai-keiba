import type { PageLoad } from './$types';
import { PUBLIC_API_URL } from '$env/static/public';

export const load: PageLoad = async () => {
  const response = await fetch(`${PUBLIC_API_URL}/api/races`);
  const data = await response.json();
  return {
    races: data.races
  };
};