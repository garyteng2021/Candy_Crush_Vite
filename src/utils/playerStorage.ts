export const getLocalScore = (): number => {
  return parseInt(localStorage.getItem('score') || '0', 10);
};

export const setLocalScore = (score: number) => {
  localStorage.setItem('score', String(score));
};