import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

interface GridImageProps {
  src: string;
  rawSrc?: string;
  alt: string;
  onClick: () => void;
}

export default function GridImage({ src, rawSrc, alt, onClick }: GridImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setCurrentSrc(src);
    setLoaded(false);
    setErrored(false);
  }, [src]);

  const handleImageError = () => {
    // Step down progressive resolution ladder if higher res is unavailable on Pinterest CDN:
    // 1. If /originals/ failed, try /736x/
    if (currentSrc.includes('/originals/')) {
      setCurrentSrc(currentSrc.replace('/originals/', '/736x/'));
      return;
    }
    // 2. If /736x/ failed, try /564x/
    if (currentSrc.includes('/736x/')) {
      setCurrentSrc(currentSrc.replace('/736x/', '/564x/'));
      return;
    }
    // 3. If /564x/ failed, try /474x/
    if (currentSrc.includes('/564x/')) {
      setCurrentSrc(currentSrc.replace('/564x/', '/474x/'));
      return;
    }
    // 4. If /474x/ failed, try /236x/
    if (currentSrc.includes('/474x/')) {
      setCurrentSrc(currentSrc.replace('/474x/', '/236x/'));
      return;
    }
    // 5. If raw thumbnail URL was passed and different, try rawSrc
    if (rawSrc && currentSrc !== rawSrc) {
      setCurrentSrc(rawSrc);
      return;
    }

    // All fallbacks exhausted
    setLoaded(true);
    setErrored(true);
  };

  return (
    <div
      className={`showcase-grid-post${loaded ? ' grid-img-ready' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label={`View ${alt}`}
    >
      {!loaded && !errored && <div className="grid-img-skeleton" />}
      {!errored ? (
        <img
          key={currentSrc}
          src={currentSrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={handleImageError}
        />
      ) : (
        <div className="grid-img-error">
          <Icon icon="mdi:image-broken-variant" />
        </div>
      )}
      <div className="grid-img-hover-icon">
        <Icon icon="mdi:magnify-plus-outline" />
      </div>
    </div>
  );
}
