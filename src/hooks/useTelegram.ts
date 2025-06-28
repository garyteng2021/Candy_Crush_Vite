const useTelegram = (): string => {
  if (window.Telegram?.WebApp?.initDataUnsafe?.user?.id) {
    return String(window.Telegram.WebApp.initDataUnsafe.user.id);
  }
  return 'guest';
};

export default useTelegram;