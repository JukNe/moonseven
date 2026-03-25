'use client';

import { useState, useEffect } from 'react';

export function useDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check localStorage and system preference
    const stored = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldBeDark = stored !== null ? stored === 'true' : prefersDark;
    setIsDark(shouldBeDark);
    
    // Apply immediately
    const html = document.documentElement;
    if (shouldBeDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    // Read current state from DOM to ensure accuracy
    const html = document.documentElement;
    const currentlyDark = html.classList.contains('dark');
    const newValue = !currentlyDark;
    
    setIsDark(newValue);
    localStorage.setItem('darkMode', newValue.toString());
    
    if (newValue) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  };

  return { toggleDarkMode };
}
