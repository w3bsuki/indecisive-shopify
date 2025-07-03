'use client';

import { useEffect } from 'react';

export function ViewportHeightFix() {
  useEffect(() => {
    // Fix for mobile viewport height that accounts for browser UI
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Set initial value
    setViewportHeight();

    // Update on resize (handles orientation change and browser UI show/hide)
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      // Debounce resize events to prevent layout thrashing
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setViewportHeight, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  return null;
}