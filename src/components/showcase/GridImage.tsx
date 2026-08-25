import { useState } from 'react';
import { Icon } from '@iconify/react';

interface GridImageProps {
  src: string;
  alt: string;
  onClick: () => void;
}

export default function GridImage({ src, alt, onClick }: GridImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

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
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => {
            setLoaded(true);
            setErrored(true);
          }}
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
