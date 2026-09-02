import { useState, useEffect, useRef, useCallback } from 'react';
import type { PageType } from '../types';

export function useNavigation() {
  const [page, setPage] = useState<PageType>('home');
  const [prevPage, setPrevPage] = useState<PageType>('home');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [transitionPhase, setTransitionPhase] = useState<'idle' | 'enter' | 'exit'>('idle');

  const section2Ref = useRef<HTMLDivElement>(null);
  const subpageRef = useRef<HTMLDivElement>(null);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigateTo = useCallback(
    (newPage: PageType) => {
      // If clicking same page, just scroll to top smoothly
      if (newPage === page) {
        if (newPage === 'home') {
          const scrollContainer = document.querySelector('.scroll-container');
          if (scrollContainer) scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const subpage = document.querySelector('.subpage-container');
          if (subpage) subpage.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }

      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }

      // Step 1: Start Enter Animation (rectangles slide in to cover the page at original smooth speed)
      setIsTransitioning(true);
      setTransitionPhase('enter');

      // Step 2: Midpoint swap (at 450ms, rectangles fully cover screen)
      transitionTimeoutRef.current = setTimeout(() => {
        setPage((currentPage) => {
          if (newPage === 'about' && (currentPage === 'logic' || currentPage === 'aesthetics')) {
            setPrevPage(currentPage);
          }
          return newPage;
        });

        const path = newPage === 'home' ? '/' : `/${newPage}`;
        window.history.pushState({ page: newPage }, '', path);

        // Reset scroll position immediately while screen is covered
        window.scrollTo(0, 0);
        document.documentElement.scrollTo(0, 0);
        document.body.scrollTo(0, 0);
        const scrollContainer = document.querySelector('.scroll-container');
        if (scrollContainer) scrollContainer.scrollTo(0, 0);
        const subContainer = document.querySelector('.subpage-container');
        if (subContainer) subContainer.scrollTo(0, 0);

        // Step 3: Start Exit Animation (speedy and crisp exit)
        setTransitionPhase('exit');

        // Step 4: Complete transition (rapid 280ms exit)
        transitionTimeoutRef.current = setTimeout(() => {
          setIsTransitioning(false);
          setTransitionPhase('idle');
        }, 280);
      }, 450);
    },
    [page]
  );

  // Sync state with browser URLs & history popstates (Back/Forward buttons)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const statePage = event.state?.page as PageType | undefined;
      const targetPage: PageType = statePage || (() => {
        const path = window.location.pathname.toLowerCase();
        const hash = window.location.hash.toLowerCase();
        if (path === '/logic' || hash === '#logic' || hash === '#/logic') return 'logic';
        if (path === '/aesthetics' || hash === '#aesthetics' || hash === '#/aesthetics') return 'aesthetics';
        if (path === '/about' || hash === '#about' || hash === '#/about') return 'about';
        if (
          path === '/reminder' ||
          hash === '#reminder' ||
          hash === '#/reminder' ||
          path === '/release' ||
          hash === '#release' ||
          hash === '#/release' ||
          path === '/reminder.afk' ||
          hash === '#reminder.afk' ||
          hash === '#/reminder.afk' ||
          path === '/reminder.apk' ||
          hash === '#reminder.apk' ||
          hash === '#/reminder.apk'
        ) {
          return 'reminder';
        }
        if (path === '/admin' || hash === '#admin' || hash === '#/admin') return 'admin';
        return 'home';
      })();

      navigateTo(targetPage);
    };

    window.addEventListener('popstate', handlePopState);

    // Initial check on page load / refresh
    const initialPath = window.location.pathname.toLowerCase();
    const initialHash = window.location.hash.toLowerCase();
    if (initialPath === '/logic' || initialHash === '#logic' || initialHash === '#/logic') {
      setPage('logic');
    } else if (initialPath === '/aesthetics' || initialHash === '#aesthetics' || initialHash === '#/aesthetics') {
      setPage('aesthetics');
    } else if (initialPath === '/about' || initialHash === '#about' || initialHash === '#/about') {
      setPage('about');
    } else if (
      initialPath === '/reminder' ||
      initialHash === '#reminder' ||
      initialHash === '#/reminder' ||
      initialPath === '/release' ||
      initialHash === '#release' ||
      initialHash === '#/release' ||
      initialPath === '/reminder.afk' ||
      initialHash === '#reminder.afk' ||
      initialHash === '#/reminder.afk' ||
      initialPath === '/reminder.apk' ||
      initialHash === '#reminder.apk' ||
      initialHash === '#/reminder.apk'
    ) {
      setPage('reminder');
    } else if (initialPath === '/admin' || initialHash === '#admin' || initialHash === '#/admin') {
      setPage('admin');
    } else {
      setPage('home');
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [navigateTo]);


  // Scroll to top instantly when entering a subpage
  useEffect(() => {
    if (page === 'logic' || page === 'aesthetics' || page === 'about' || page === 'reminder') {
      window.scrollTo(0, 0);
      document.documentElement.scrollTo(0, 0);
      document.body.scrollTo(0, 0);
      if (subpageRef.current) {
        subpageRef.current.scrollTo(0, 0);
      } else {
        setTimeout(() => {
          const container = document.querySelector('.subpage-container');
          if (container) container.scrollTo(0, 0);
        }, 0);
      }
    }
  }, [page]);

  return {
    page,
    prevPage,
    isTransitioning,
    transitionPhase,
    navigateTo,
    section2Ref,
    subpageRef
  };
}
