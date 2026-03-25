'use client';

import { useState } from 'react';
import { useDarkMode } from '../hooks/useDarkMode';
import MoonIcon from './MoonIcon';
import NavLink from './NavLink';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toggleDarkMode } = useDarkMode();

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 80; // Account for fixed navbar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsMenuOpen(false); // Close mobile menu after clicking
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <a 
              href="#home" 
              onClick={(e) => handleScroll(e, 'home')}
              className="text-xl font-bold text-black dark:text-zinc-50 cursor-pointer"
            >
              Moon Seven
            </a>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <div className="ml-10 flex items-baseline space-x-8">
              <NavLink href="#home" onClick={(e) => handleScroll(e, 'home')} className="px-3 py-2 text-sm font-medium">
                Home
              </NavLink>
              <NavLink href="#about" onClick={(e) => handleScroll(e, 'about')} className="px-3 py-2 text-sm font-medium">
                About
              </NavLink>
              <NavLink href="#contact" onClick={(e) => handleScroll(e, 'contact')} className="px-3 py-2 text-sm font-medium">
                Contact
              </NavLink>
            </div>
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="ml-4 p-2 rounded-md text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-zinc-500 transition-colors"
              aria-label="Toggle dark mode"
            >
              <MoonIcon />
            </button>
          </div>

          {/* Mobile Menu Button and Dark Mode Toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-zinc-500 transition-colors"
              aria-label="Toggle dark mode"
            >
              <MoonIcon />
            </button>
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-zinc-500 transition-transform duration-200"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-black border-t border-zinc-200 dark:border-zinc-800">
          {[
            { href: '#home', label: 'Home', delay: '0.1s' },
            { href: '#about', label: 'About', delay: '0.15s' },
            { href: '#contact', label: 'Contact', delay: '0.2s' },
          ].map((item, index) => (
            <NavLink
              key={item.href}
              href={item.href}
              onClick={(e) => handleScroll(e, item.href.slice(1))}
              className={`block px-3 py-2 text-base font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-all duration-200 ${
                isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
              }`}
              style={{ transitionDelay: isMenuOpen ? item.delay : '0s' }}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
