import { useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import { FALLBACK_PIN_IMAGES } from '../../constants/pinterestFallback';
import { EXTERNAL_LINKS } from '../../constants/links';
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

export default function AestheticsCollageSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all-pins');
  const [boardsMap, setBoardsMap] = useState<Record<string, string[]>>({
    'all-pins': FALLBACK_PIN_IMAGES,
  });
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadBoards() {
      const results = await Promise.allSettled(
        BOARD_NAMES.map(async (board) => {
          const url = `https://api.rss2json.com/v1/api.json?rss_url=https://www.pinterest.com/${PINTEREST_USERNAME}/${board}.rss`;
          const res = await fetch(url);
          if (!res.ok) return { board, images: [] as string[] };
          const data: { items?: RssFeedItem[] } = await res.json();
          const images: string[] = [];
          for (const item of data.items ?? []) {
            const raw = item.thumbnail || '';
            const htmlMatch = (item.description || item.content || '').match(
              /<img[^>]+src="([^">]+)"/i,
            );
            const src = (raw || htmlMatch?.[1] || '').replace(
              /\/(236x|474x|564x)\//,
              '/736x/',
            );
            if (src && !images.includes(src)) {
              images.push(src);
            }
          }
          return { board, images };
        }),
      );

      if (!active) return;
      const nextMap: Record<string, string[]> = {
        'all-pins': FALLBACK_PIN_IMAGES,
      };
      for (const result of results) {
        if (result.status === 'fulfilled' && result.value.images.length > 0) {
          nextMap[result.value.board] = result.value.images;
        }
      }
      setBoardsMap(nextMap);
    }

    loadBoards();
    return () => {
      active = false;
    };
  }, []);

  const activePins = useMemo(() => {
    const list = boardsMap[selectedCategory];
    return list && list.length > 0 ? list : FALLBACK_PIN_IMAGES;
  }, [boardsMap, selectedCategory]);

  const safeIdx = activeIdx < activePins.length ? activeIdx : 0;
  const currentPin = activePins[safeIdx] || FALLBACK_PIN_IMAGES[0];
  const categoryLabel = CATEGORY_LABELS[selectedCategory] || 'All';

  const visibleStrip = useMemo(() => {
    const count = Math.min(6, activePins.length);
    const start =
      activePins.length <= 6
        ? 0
        : Math.min(Math.max(0, safeIdx - 1), activePins.length - count);
    return activePins.slice(start, start + count).map((url, offset) => ({
      url,
      index: start + offset,
    }));
  }, [activePins, safeIdx]);

  const galleryImages: GalleryImage[] = useMemo(
    () =>
      activePins.map((url, idx) => ({
        url,
        title: `${categoryLabel} Visual #${idx + 1}`,
      })),
    [activePins, categoryLabel],
  );

  const handleCategoryChange = (board: string) => {
    setSelectedCategory(board);
    setActiveIdx(0);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + activePins.length) % activePins.length);
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % activePins.length);
  };

  return (
    <section
      id="aesthetics-collage"
      className="aes-ribbon"
      aria-label="Manipulations, Flyer Designs & Visual Archive"
    >
      {/* Top Editorial Stage */}
      <div className="aes-ribbon__top">
        <nav className="aes-ribbon__nav" aria-label="Design categories">
          <div className="aes-ribbon__nav-left">
            {BOARD_NAMES.slice(0, 3).map((board) => (
              <button
                key={board}
                type="button"
                className={`aes-ribbon__tab ${
                  selectedCategory === board ? 'is-active' : ''
                }`}
                onClick={() => handleCategoryChange(board)}
              >
                {CATEGORY_LABELS[board]}
              </button>
            ))}
          </div>

          <div className="aes-ribbon__brand">
            <span className="aes-ribbon__brand-mark">PN</span>
            <span>Visual Studio</span>
          </div>

          <div className="aes-ribbon__nav-right">
            {BOARD_NAMES.slice(3).map((board) => (
              <button
                key={board}
                type="button"
                className={`aes-ribbon__tab ${
                  selectedCategory === board ? 'is-active' : ''
                }`}
                onClick={() => handleCategoryChange(board)}
              >
                {CATEGORY_LABELS[board]}
              </button>
            ))}
          </div>
        </nav>

        <div className="aes-ribbon__stage">
          {/* Left: Vertical Primary Ribbon + Dashed Framed Artwork */}
          <div className="aes-ribbon__left-col">
            <div className="aes-ribbon__pillar" aria-hidden="true" />

            <button
              type="button"
              className="aes-ribbon__frame-btn"
              onClick={() => setLightboxOpen(true)}
              aria-label={`Open ${categoryLabel} piece #${safeIdx + 1} in lightbox`}
            >
              <img
                src={currentPin}
                alt={`${categoryLabel} graphic work ${safeIdx + 1}`}
                className="aes-ribbon__frame-img"
                loading="lazy"
              />
            </button>

            <button
              type="button"
              className="aes-ribbon__go-back"
              onClick={handlePrev}
            >
              <span>&laquo;</span>
              <span>PREV PIECE</span>
            </button>
          </div>

          {/* Right: Editorial Details & Socials */}
          <div className="aes-ribbon__right-col">
            <p className="aes-ribbon__kicker">
              PINTEREST ARCHIVE &middot; @{PINTEREST_USERNAME.toUpperCase()}
            </p>
            <h2 className="aes-ribbon__heading">
              {categoryLabel} &amp; Manipulation #{String(safeIdx + 1).padStart(2, '0')}
            </h2>

            <p className="aes-ribbon__copy">
              Photo manipulations, event flyers, brand identities, and social
              media visuals crafted across Fiverr (Level 2 Seller), Sentered
              Media, and campus design leadership.
            </p>
            <p className="aes-ribbon__copy">
              Every composition balances high-contrast lighting, Swiss grid
              discipline, and expressive typography &mdash; synced live from my
              curated Pinterest boards.
            </p>

            <p className="aes-ribbon__social-label">Design Channels</p>
            <div className="aes-ribbon__socials">
              <a
                href={EXTERNAL_LINKS.PINTEREST}
                target="_blank"
                rel="noopener noreferrer"
                className="aes-ribbon__social-btn"
                aria-label="Pinterest"
              >
                <Icon icon="mdi:pinterest" width={16} height={16} />
              </a>
              <a
                href={EXTERNAL_LINKS.BEHANCE}
                target="_blank"
                rel="noopener noreferrer"
                className="aes-ribbon__social-btn"
                aria-label="Behance"
              >
                <Icon icon="simple-icons:behance" width={14} height={14} />
              </a>
              <a
                href={EXTERNAL_LINKS.INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                className="aes-ribbon__social-btn"
                aria-label="Instagram"
              >
                <Icon icon="mdi:instagram" width={15} height={15} />
              </a>
              <a
                href={EXTERNAL_LINKS.LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                className="aes-ribbon__social-btn"
                aria-label="LinkedIn"
              >
                <Icon icon="mdi:linkedin" width={15} height={15} />
              </a>
            </div>

            <button
              type="button"
              className="aes-ribbon__all-btn"
              onClick={() => setLightboxOpen(true)}
            >
              INSPECT FULL RESOLUTION <span>&#9662;</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Watermarked 6-Card Strip */}
      <div className="aes-ribbon__bottom">
        <div className="aes-ribbon__watermark" aria-hidden="true">
          LATEST WORKS
        </div>

        <div className="aes-ribbon__carousel-wrap">
          <button
            type="button"
            className="aes-ribbon__arrow"
            onClick={handlePrev}
            aria-label="Previous design"
          >
            &lsaquo;
          </button>

          <div className="aes-ribbon__strip">
            {visibleStrip.map((item) => {
              const isActive = item.index === safeIdx;
              return (
                <button
                  key={`${item.url}-${item.index}`}
                  type="button"
                  className={`aes-ribbon__card ${isActive ? 'is-active' : ''}`}
                  onClick={() => setActiveIdx(item.index)}
                  aria-label={`Select ${categoryLabel} piece ${item.index + 1}`}
                >
                  <img
                    src={item.url}
                    alt={`${categoryLabel} thumbnail ${item.index + 1}`}
                    className="aes-ribbon__card-img"
                    loading="lazy"
                  />
                  <div className="aes-ribbon__card-caption">
                    <span className="aes-ribbon__card-kicker">
                      {categoryLabel}
                    </span>
                    <span className="aes-ribbon__card-title">
                      Archive #{String(item.index + 1).padStart(2, '0')}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="aes-ribbon__arrow"
            onClick={handleNext}
            aria-label="Next design"
          >
            &rsaquo;
          </button>
        </div>

        <p className="aes-ribbon__counter">
          {safeIdx + 1} / {activePins.length}
        </p>
      </div>

      <Lightbox
        images={galleryImages}
        currentIndex={safeIdx}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(index) => setActiveIdx(index)}
      />
    </section>
  );
}
