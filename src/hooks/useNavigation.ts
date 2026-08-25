import { useState, useEffect, useRef, useCallback } from 'react';
import type { PageType } from '../types';

export function useNavigation() {
  const [page, setPage] = useState<PageType>('home');
  const [prevPage, setPrevPage] = useState<PageType>('home');
  const section2Ref = useRef<HTMLDivElement>(null);
  const fromSubpageRef = useRef<boolean>(false);
  const subpageRef = useRef<HTMLDivElement>(null);

  const navigateTo = useCallback((newPage: PageType) => {
    setPage((currentPage) => {
      if (newPage === 'home' && currentPage !== 'home') {
        fromSubpageRef.current = true;
      }
      if (newPage === 'about' && (currentPage === 'logic' || currentPage === 'aesthetics')) {
        setPrevPage(currentPage);
      }
      return newPage;
    });

    const path = newPage === 'home' ? '/' : `/${newPage}`;
    window.history.pushState({ page: newPage }, '', path);
  }, []);

  // Sync state with browser URLs & history popstates (Back/Forward buttons)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const statePage = event.state?.page as PageType | undefined;
      if (statePage) {
        setPage((currentPage) => {
          if (statePage === 'home' && currentPage !== 'home') {
            fromSubpageRef.current = true;
          }
          return statePage;
        });
      } else {
        // Fallback checks
        const path = window.location.pathname.toLowerCase();
        const hash = window.location.hash.toLowerCase();
        if (path === '/logic' || hash === '#logic' || hash === '#/logic') setPage('logic');
        else if (path === '/aesthetics' || hash === '#aesthetics' || hash === '#/aesthetics') setPage('aesthetics');
        else if (path === '/about' || hash === '#about' || hash === '#/about') setPage('about');
        else if (path === '/admin' || hash === '#admin' || hash === '#/admin') setPage('admin');
        else {
          setPage((currentPage) => {
            if (currentPage !== 'home') fromSubpageRef.current = true;
            return 'home';
          });
        }
      }
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
    } else if (initialPath === '/admin' || initialHash === '#admin' || initialHash === '#/admin') {
      setPage('admin');
    } else {
      setPage('home');
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Scroll back to Section 2 instantly if returning from a subpage
  useEffect(() => {
    if (page === 'home' && fromSubpageRef.current) {
      setTimeout(() => {
        section2Ref.current?.scrollIntoView({ block: 'start', behavior: 'auto' });
        fromSubpageRef.current = false;
      }, 0);
    }
  }, [page]);

  // Scroll to top instantly when entering a subpage
  useEffect(() => {
    if (page === 'logic' || page === 'aesthetics' || page === 'about') {
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
    navigateTo,
    section2Ref,
    subpageRef
  };
}
