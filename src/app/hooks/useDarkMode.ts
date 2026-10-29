'use client';

export function useDarkMode() {
  const toggleDarkMode = () => {
    const html = document.documentElement;
    const newValue = !html.classList.contains('dark');
    localStorage.setItem('darkMode', String(newValue));
    html.classList.toggle('dark', newValue);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', newValue ? '#0a0a0a' : '#fafafa');
  };

  return { toggleDarkMode };
}
