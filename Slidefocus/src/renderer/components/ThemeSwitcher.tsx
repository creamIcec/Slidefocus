import { useEffect, useState } from 'react';

const ThemeSwitcher = () => {
  const [isDark, setIsDark] = useState<boolean>(false);

  const switchDarkMode = () => {
    setIsDark(!isDark);
  };

  useEffect(() => {
    if (isDark) {
      if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
      }
    } else {
      document.documentElement.classList.add('dark');
    }
  }, [isDark]);

  return (
    <button
      className="cursor-pointer hover:bg-bg dark:hover:bg-bg_dark rounded-xl p-1"
      onClick={() => switchDarkMode()}
    >
      <i className="material-symbols-outlined text-3xl text-black dark:text-white">
        dark_mode
      </i>
    </button>
  );
};

export { ThemeSwitcher };
