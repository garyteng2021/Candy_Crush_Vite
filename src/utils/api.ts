import { ScoreEntry } from '../types/game';

export async function submitScore(userId: string, score: number) {
  const res = await fetch('https://h5game-backend-production.up.railway.app/play', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ user_id: userId, score: String(score) })
  });
  if (!res.ok) throw new Error('Failed to submit score');
  return await res.json();
}

export async function loadRanking(): Promise<ScoreEntry[]> {
  const res = await fetch('https://h5game-backend-production.up.railway.app/api/rank');
  if (!res.ok) throw new Error('Failed to load ranking');
  return await res.json();
}