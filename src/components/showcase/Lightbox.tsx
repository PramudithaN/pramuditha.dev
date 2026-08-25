import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';

export interface GalleryImage {
  src: string;
  board: string;
}

interface LightboxProps {
  images: GalleryImage[];
  startIndex: number;
  onClose: () => void;
}

export default function Lightbox({ images, startIndex, onClose }: LightboxProps) {
  const [current, setCurrent] = useState(startIndex);
  const [imgLoaded, setImgLoaded] = useState(false);

  const prev = useCallback(() => {
    setImgLoaded(false);
    setCurrent((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback(() => {
    setImgLoaded(false);
    setCurrent((i) => (i + 1) % images.length);
  }, [images.length]);

  // Keyboard navigation + Escape to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, prev, next]);

  // Lock ALL scroll containers while lightbox is open, preserving scroll position
  useEffect(() => {
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const subpage = document.querySelector<HTMLElement>('.subpage-container');
    const prevSubpageOverflow = subpage ? subpage.style.overflow : '';
    const savedScrollTop = subpage ? subpage.scrollTop : 0;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    if (subpage) {
      subpage.style.overflow = 'hidden';
      subpage.scrollTop = savedScrollTop;
    }

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      if (subpage) {
        subpage.style.overflow = prevSubpageOverflow;
        subpage.scrollTop = savedScrollTop;
      }
    };
  }, []);

  return createPortal(
    <div className="lightbox-overlay" onClick={onClose} aria-modal="true" role="dialog">
      {/* Close */}
      <button
        type="button"
        className="lightbox-close"
        onClick={onClose}
        aria-label="Close"
      >
        <Icon icon="mdi:close" />
      </button>

      {/* Counter */}
      <div className="lightbox-counter">
        {current + 1} / {images.length}
      </div>

      {/* Prev */}
      {images.length > 1 && (
        <button
          type="button"
          className="lightbox-nav lightbox-prev"
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          aria-label="Previous image"
        >
          <Icon icon="mdi:chevron-left" />
        </button>
      )}

      {/* Image */}
      <div className="lightbox-img-wrap" onClick={(e) => e.stopPropagation()}>
        {!imgLoaded && <div className="lightbox-img-skeleton" />}
        <img
          key={images[current].src}
          src={images[current].src}
          alt=""
          className={`lightbox-img${imgLoaded ? ' lightbox-img-ready' : ''}`}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgLoaded(true)}
        />
      </div>

      {/* Next */}
      {images.length > 1 && (
        <button
          type="button"
          className="lightbox-nav lightbox-next"
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          aria-label="Next image"
        >
          <Icon icon="mdi:chevron-right" />
        </button>
      )}
    </div>,
    document.body
  );
}
