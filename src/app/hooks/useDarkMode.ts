'use client';

export function useDarkMode() {
  const toggleDarkMode = () => {
    const html = document.documentElement;
    const newValue = !html.classList.contains('dark');
    localStorage.setItem('darkMode', String(newValue));
    html.classList.toggle('dark', newValue);
  };

  return { toggleDarkMode };
}
