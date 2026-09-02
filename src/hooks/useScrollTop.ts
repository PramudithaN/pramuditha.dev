import { useState, useEffect, type RefObject } from 'react';
import type { PageType } from '../types';

export function useScrollTop(page: PageType, subpageRef: RefObject<HTMLElement | null>) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    if (page !== 'logic' && page !== 'aesthetics' && page !== 'about' && page !== 'reminder') {
      setShowScrollTop(false);
      return;
    }

    const container = subpageRef.current;
    if (!container) return;

    const handleScroll = () => {
      setShowScrollTop(container.scrollTop > 400);
    };

    handleScroll();
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [page, subpageRef]);

  const scrollToTop = () => {
    subpageRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return { showScrollTop, scrollToTop };
}
