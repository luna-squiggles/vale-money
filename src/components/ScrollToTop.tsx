import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigationContext } from '../contexts/NavigationContext.tsx';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const { setIsNavigating } = useNavigationContext();

  // 1. Always scroll to the top synchronously on path change.
  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  // 2. Defer setting isNavigating to false to allow the scroll to complete
  //    and the new layout to be painted, ensuring Framer Motion can animate smoothly.
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 100); // A small delay is crucial for the animation to work correctly.

    return () => clearTimeout(timer);
  }, [pathname, setIsNavigating]);

  return null;
};

export default ScrollToTop; 