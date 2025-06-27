import axios from 'axios';

const BASE_URL = 'https://h5game-backend-production.up.railway.app';

export async function submitScore(userId: string, score: number) {
  try {
    const response = await axios.post(`${BASE_URL}/play`, {
      user_id: userId,
      score,
    });
    return response.data;
  } catch (err: any) {
    alert("提交失败: " + (err.response?.data?.error || "未知错误"));
    throw err;
  }
}

export async function fetchLeaderboard() {
  try {
    const response = await axios.get(`${BASE_URL}/api/rank`);
    return response.data;
  } catch (err) {
    console.error('排行榜获取失败:', err);
    return [];
  }
}
