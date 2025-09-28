import type { PageLoad } from './$types';
import { PUBLIC_API_URL } from '$env/static/public';

// SSRを無効化してクライアントサイドでのみ実行
export const ssr = false;

export const load: PageLoad = async () => {
  const response = await fetch(`${PUBLIC_API_URL}/api/races`);
  const data = await response.json();
  return {
    races: data.races
  };
};