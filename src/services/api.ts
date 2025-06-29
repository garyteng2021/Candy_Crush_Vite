import { RankingEntry, GameResponse } from '../types/game';
import { API_BASE_URL } from '../config/gameConfig';

export const apiService = {
  async submitScore(userId: string, score: number): Promise<GameResponse> {
    const response = await fetch(`${API_BASE_URL}/play`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        score: score
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || 'Failed to submit score');
    }

    return response.json();
  },

  async getRanking(): Promise<RankingEntry[]> {
    const response = await fetch(`${API_BASE_URL}/api/rank`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch ranking');
    }

    return response.json();
  }
};