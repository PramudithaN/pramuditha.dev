import { useEffect, useId, useMemo, useState } from 'react';
import { FALLBACK_PIN_IMAGES } from '../../constants/pinterestFallback';
import Lightbox, { type GalleryImage } from '../showcase/Lightbox';
import './aesthetics-collage.css';

const PINTEREST_USERNAME = 'ad0bep';
const BOARD_NAMES = ['all-pins', 'logos', 'flyers', 'manipulations', 'social'] as const;

const CATEGORY_LABELS: Record<string, string> = {
  'all-pins': 'All',
  logos: 'Logos',
  flyers: 'Flyers',
  manipulations: 'Manipulations',
  social: 'Social',
};

interface RssFeedItem {
  thumbnail?: string;
  description?: string;
  content?: string;
}

interface PolaroidSlotConfig {
  aspect: 'portrait' | 'landscape' | 'wide';
  tight?: boolean;
  attachment: 'pin' | 'tape' | 'tape-dark' | 'tape-corner' | 'paperclip';
  caption?: string;
  verticalNote?: string;
}

const POLAROID_SLOTS: readonly PolaroidSlotConfig[] = [
  {
    aspect: 'portrait',
    attachment: 'pin',
    caption: "LIFE'S NOT A RACE.",
  },
  {
    aspect: 'landscape',
    tight: true,
    attachment: 'tape',
    caption: 'DO THINGS AT YOUR OWN PACE.',
  },
  {
    aspect: 'portrait',
    attachment: 'paperclip',
    verticalNote: "DO THINGS AT YOUR OWN PACE. LIFE'S NOT A RACE.",
  },
  {
    aspect: 'wide',
    tight: true,
    attachment: 'tape-dark',
    caption: 'Live in the moment.',
  },
  {
    aspect: 'landscape',
    attachment: 'pin',
    caption: 'Stay focused on your goals.',
  },
  {
    aspect: 'landscape',
    tight: true,
    attachment: 'tape-corner',
  },
];

export default function AestheticsCollageSection() {
  const uid = useId().replace(/:/g, '');
  const [activeCategory, setActiveCategory] = useState<string>('all-pins');
  const [boardImages, setBoardImages] = useState<Record<string, GalleryImage[]>>({});
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxStart, setLightboxStart] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchBoard = async (board: string) => {
      const rssName = board === 'all-pins' ? 'feed' : board;
      const rawUrl = `https://www.pinterest.com/${PINTEREST_USERNAME}/${rssName}.rss`;
      const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rawUrl)}`;

      try {
        const res = await fetch(proxyUrl);
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as { status?: string; items?: RssFeedItem[] };
        if (data.status !== 'ok' || !Array.isArray(data.items) || cancelled) return;

        const imgs: GalleryImage[] = [];
        data.items.forEach((item) => {
          let imgUrl = '';
          if (typeof item.thumbnail === 'string' && item.thumbnail.includes('pinimg.com')) {
            imgUrl = item.thumbnail;
          } else {
            const str = String(item.description || '') + String(item.content || '');
            const match = str.match(/https?:\/\/[^"'\s>]+\.pinimg\.com\/[^"'\s>]+/i);
            if (match) {
              imgUrl = match[0];
            }
          }

          if (imgUrl) {
            imgs.push({
              src: imgUrl.replace(/\/\d+x\//, '/736x/'),
              rawSrc: imgUrl,
              board,
            });
          }
        });

        if (imgs.length > 0 && !cancelled) {
          setBoardImages((prev) => ({ ...prev, [board]: imgs }));
        }
      } catch {
        // Fallback images are already available
      }
    };

    BOARD_NAMES.forEach((board) => {
      void fetchBoard(board);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const displayedImages = useMemo<GalleryImage[]>(() => {
    const live = boardImages[activeCategory];
    if (live && live.length > 0) return live;

    if (activeCategory === 'all-pins') {
      return FALLBACK_PIN_IMAGES;
    }

    const filtered = FALLBACK_PIN_IMAGES.filter((img) => img.board === activeCategory);
    return filtered.length > 0 ? filtered : FALLBACK_PIN_IMAGES;
  }, [activeCategory, boardImages]);

  const collagePhotos = useMemo(() => displayedImages.slice(0, 6), [displayedImages]);

  const handleOpenLightbox = (idx: number) => {
    setLightboxStart(idx);
    setLightboxOpen(true);
  };

  const paperFilterId = `collage-paper-${uid}`;

  return (
    <section
      id="aesthetics-collage"
      className="aesthetics-collage"
      aria-label="Aesthetics Photo Collage"
    >
      {/* Procedural Crumpled Dark Paper Texture */}
      <svg className="aesthetics-collage__paper-texture" aria-hidden="true">
        <filter id={paperFilterId}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.018"
            numOctaves="5"
            seed="14"
            result="noise"
          />
          <feDiffuseLighting
            in="noise"
            lightingColor="#ffffff"
            surfaceScale="2.6"
          >
            <feDistantLight azimuth="45" elevation="52" />
          </feDiffuseLighting>
        </filter>
        <rect width="100%" height="100%" filter={`url(#${paperFilterId})`} />
      </svg>

      <div className="aesthetics-collage__vignette" aria-hidden="true" />

      <div className="aesthetics-collage__inner">
        <header className="aesthetics-collage__header">
          <div>
            <p className="aesthetics-collage__eyebrow">02 / Aesthetics &amp; Visuals</p>
            <h2 className="aesthetics-collage__title">Selected Frames</h2>
          </div>

          <div className="aesthetics-collage__filters" role="tablist" aria-label="Filter visual works">
            {BOARD_NAMES.map((board) => (
              <button
                key={board}
                type="button"
                role="tab"
                aria-selected={activeCategory === board}
                className={`aesthetics-collage__filter-btn ${
                  activeCategory === board ? 'aesthetics-collage__filter-btn--active' : ''
                }`}
                onClick={() => setActiveCategory(board)}
              >
                {CATEGORY_LABELS[board]}
              </button>
            ))}
          </div>
        </header>

        <div className="aesthetics-collage__board">
          {collagePhotos.map((photo, idx) => {
            const slot = POLAROID_SLOTS[idx % POLAROID_SLOTS.length];
            return (
              <div
                key={`${photo.src}-${idx}`}
                className={`aesthetics-collage__slot aesthetics-collage__slot--${idx}`}
              >
                <button
                  type="button"
                  className={`aesthetics-collage__polaroid ${
                    slot.tight ? 'aesthetics-collage__polaroid--tight' : ''
                  }`}
                  onClick={() => handleOpenLightbox(idx)}
                  aria-label={`Open ${photo.board} photo ${idx + 1} in lightbox`}
                >
                  {slot.attachment === 'pin' && (
                    <span className="aesthetics-collage__pin" aria-hidden="true" />
                  )}
                  {slot.attachment === 'tape' && (
                    <span className="aesthetics-collage__tape" aria-hidden="true" />
                  )}
                  {slot.attachment === 'tape-dark' && (
                    <span
                      className="aesthetics-collage__tape aesthetics-collage__tape--dark"
                      aria-hidden="true"
                    />
                  )}
                  {slot.attachment === 'tape-corner' && (
                    <span
                      className="aesthetics-collage__tape aesthetics-collage__tape--corner"
                      aria-hidden="true"
                    />
                  )}
                  {slot.attachment === 'paperclip' && (
                    <svg
                      className="aesthetics-collage__paperclip"
                      viewBox="0 0 24 52"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M7 16V38C7 43.5 11.5 48 17 48C20 48 22 45.5 22 42V12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12V36"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}

                  <div
                    className={`aesthetics-collage__media aesthetics-collage__media--${slot.aspect}`}
                  >
                    <img
                      src={photo.src}
                      alt={`${CATEGORY_LABELS[photo.board] || 'Visual'} frame ${idx + 1}`}
                      className="aesthetics-collage__img"
                      loading="lazy"
                    />
                  </div>
                </button>

                {slot.caption && (
                  <p className="aesthetics-collage__caption">{slot.caption}</p>
                )}

                {slot.verticalNote && (
                  <span className="aesthetics-collage__vertical-note" aria-hidden="true">
                    {slot.verticalNote}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="aesthetics-collage__footer-hint">
          <span>Click any frame to inspect full-resolution ({displayedImages.length} works)</span>
          <span>MONOCHROME ARCHIVE</span>
        </div>
      </div>

      {lightboxOpen && (
        <Lightbox
          images={displayedImages}
          startIndex={lightboxStart}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </section>
  );
}
