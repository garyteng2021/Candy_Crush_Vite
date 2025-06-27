import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Telegram?: any;
  }
}

const useTelegram = (): string => {
  const [userId, setUserId] = useState('guest');

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      try {
        window.Telegram.WebApp.ready();
        const tgUser = window.Telegram.WebApp.initDataUnsafe?.user;
        if (tgUser && tgUser.id) {
          setUserId(String(tgUser.id));
        } else {
          alert('⚠️ 请从 Telegram 中打开游戏链接');
        }
      } catch {
        alert('⚠️ Telegram WebApp 初始化失败');
      }
    } else {
      alert('⚠️ Telegram WebApp 未加载');
    }
  }, []);

  return userId;
};

export default useTelegram;
