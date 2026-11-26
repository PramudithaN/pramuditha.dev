import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react';
import { FALLBACK_PIN_IMAGES } from '../../constants/pinterestFallback';
import type { GalleryImage } from '../showcase/Lightbox';
import InsideGalleryModal, {
  type InsideGalleryCategory,
} from './InsideGalleryModal';
import './aesthetics-collage.css';

const PINTEREST_USERNAME = 'ad0bep';
const BOARD_NAMES = ['all-pins', 'logos', 'flyers', 'manipulations', 'social'] as const;

interface CategorySlot {
  board: 'manipulations' | 'flyers' | 'logos' | 'social';
  roleLabel: string;
  title: string;
  description: string;
}

const GALLERY_CATEGORIES: CategorySlot[] = [
  {
    board: 'manipulations',
    roleLabel: 'Compositing',
    title: 'Manipulations',
    description:
      'Surreal photo composites, lighting studies, and atmospheric visual storytelling.',
  },
  {
    board: 'flyers',
    roleLabel: 'Print & Key Art',
    title: 'Flyers',
    description:
      'Event key visuals, editorial posters, and high-contrast typographic layouts.',
  },
  {
    board: 'logos',
    roleLabel: 'Identity',
    title: 'Logos',
    description:
      'Minimalist wordmarks, geometric monograms, and scalable brand marks.',
  },
  {
    board: 'social',
    roleLabel: 'Digital',
    title: 'Social',
    description:
      'Campaign carousels, digital banners, and motion-ready social creatives.',
  },
];

interface RssFeedItem {
  thumbnail?: string;
  description?: string;
  content?: string;
}

export default function AestheticsCollageSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [activeCatIndex, setActiveCatIndex] = useState(0);
  const [boardsMap, setBoardsMap] = useState<Record<string, GalleryImage[]>>(() => {
    const initial: Record<string, GalleryImage[]> = {
      'all-pins': FALLBACK_PIN_IMAGES,
    };
    for (const board of BOARD_NAMES) {
      if (board !== 'all-pins') {
        const filtered = FALLBACK_PIN_IMAGES.filter((img) => img.board === board);
        initial[board] = filtered.length > 0 ? filtered : FALLBACK_PIN_IMAGES;
      }
    }
    return initial;
  });
  const [activeBoardModal, setActiveBoardModal] = useState<string | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const scrollRoot = el.closest<HTMLElement>('.scroll-container');
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsRevealed(true);
            observer.disconnect();
            break;
          }
        }
      },
      {
        root: scrollRoot ?? null,
        threshold: 0.2,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let active = true;

    async function loadBoards() {
      const results = await Promise.allSettled(
        BOARD_NAMES.map(async (board) => {
          const url = `https://api.rss2json.com/v1/api.json?rss_url=https://www.pinterest.com/${PINTEREST_USERNAME}/${board}.rss`;
          const res = await fetch(url);
          if (!res.ok) return { board, images: [] as GalleryImage[] };
          const data: { items?: RssFeedItem[] } = await res.json();
          const images: GalleryImage[] = [];
          const seen = new Set<string>();
          for (const item of data.items ?? []) {
            const raw = item.thumbnail || '';
            const htmlMatch = (item.description || item.content || '').match(
              /<img[^>]+src="([^">]+)"/i
            );
            const rawSrc = raw || htmlMatch?.[1] || '';
            const src = rawSrc.replace(/\/(236x|474x|564x)\//, '/736x/');
            if (src && !seen.has(src)) {
              seen.add(src);
              images.push({ src, rawSrc, board });
            }
          }
          return { board, images };
        })
      );

      if (!active) return;
      setBoardsMap((prev) => {
        const nextMap = { ...prev };
        for (const result of results) {
          if (result.status === 'fulfilled' && result.value.images.length > 0) {
            nextMap[result.value.board] = result.value.images;
          }
        }
        return nextMap;
      });
    }

    loadBoards();
    return () => {
      active = false;
    };
  }, []);

  const currentCat = GALLERY_CATEGORIES[activeCatIndex];

  const categoryCovers = useMemo(() => {
    return GALLERY_CATEGORIES.map((cat) => {
      const list = boardsMap[cat.board];
      const cover = list && list.length > 0 ? list[0] : FALLBACK_PIN_IMAGES[0];
      return { ...cat, cover, allImages: list ?? FALLBACK_PIN_IMAGES };
    });
  }, [boardsMap]);

  const insideCategories = useMemo<InsideGalleryCategory[]>(() => {
    return [
      ...GALLERY_CATEGORIES.map((cat) => ({
        board: cat.board,
        title: cat.title,
        images: boardsMap[cat.board] ?? FALLBACK_PIN_IMAGES,
      })),
      {
        board: 'all-pins',
        title: 'All Archive',
        images: boardsMap['all-pins'] ?? FALLBACK_PIN_IMAGES,
      },
    ];
  }, [boardsMap]);

  const openBoardGallery = (board: string) => {
    setActiveBoardModal(board);
  };

  const handlePrevCat = () => {
    setActiveCatIndex(
      (prev) => (prev - 1 + GALLERY_CATEGORIES.length) % GALLERY_CATEGORIES.length
    );
  };

  const handleNextCat = () => {
    setActiveCatIndex((prev) => (prev + 1) % GALLERY_CATEGORIES.length);
  };

  return (
    <section
      ref={sectionRef}
      id="aesthetics-collage"
      className={`arch-gallery ${isRevealed ? 'is-revealed' : ''}`}
      aria-label="Visual Design Gallery"
    >
      {/* Top Minimal Header */}
      <header className="arch-gallery__header">
        <div className="arch-gallery__brand" aria-hidden="true" />

        <div className="arch-gallery__kicker">
          <span className="arch-gallery__kicker-muted">THE ART OF:</span>{' '}
          <strong className="arch-gallery__kicker-bold">
            {currentCat.title.toUpperCase()}
          </strong>
        </div>

        <div className="arch-gallery__header-nav">
          <button
            type="button"
            className="arch-gallery__nav-btn"
            onClick={handlePrevCat}
            aria-label="Previous category"
          >
            <ArrowLeft size={14} />
          </button>
          <button
            type="button"
            className="arch-gallery__nav-btn"
            onClick={handleNextCat}
            aria-label="Next category"
          >
            <ArrowRight size={14} />
          </button>
        </div>
      </header>

      {/* Main Asymmetric Split Layout */}
      <div className="arch-gallery__split">
        {/* Left Editorial Column */}
        <aside className="arch-gallery__left">
          <div className="arch-gallery__left-main" key={currentCat.board}>
            <h2 className="arch-gallery__title">GALLERY</h2>
            <p className="arch-gallery__subtitle">
              {currentCat.title.toUpperCase()} &mdash; {currentCat.roleLabel}
            </p>
            <p className="arch-gallery__desc">{currentCat.description}</p>

            <button
              type="button"
              className="arch-gallery__view-more"
              onClick={() => openBoardGallery(currentCat.board)}
            >
              <span className="arch-gallery__circle-icon">
                <ChevronRight size={14} />
              </span>
              <span>View more</span>
            </button>
          </div>

          <button
            type="button"
            className="arch-gallery__bottom-cue"
            onClick={() => openBoardGallery('all-pins')}
          >
            <span className="arch-gallery__down-badge">
              <ArrowDown size={13} />
            </span>
            <span>EXPLORE ALL VISUAL ARCHIVES</span>
          </button>
        </aside>

        {/* Right 4 Vertical Dashed Columns (1 Image per Category) */}
        <div className="arch-gallery__columns">
          {categoryCovers.map((item, idx) => {
            const numLabel = String(idx + 1).padStart(2, '0');
            const isSelected = idx === activeCatIndex;
            return (
              <div
                key={item.board}
                className={`arch-gallery__col ${isSelected ? 'is-active' : ''}`}
                style={{ '--col-i': idx } as React.CSSProperties}
              >
                <div className="arch-gallery__col-meta">
                  <span className="arch-gallery__col-label">{item.roleLabel}</span>
                  <span className="arch-gallery__col-name">{item.title}</span>
                </div>

                <button
                  type="button"
                  className="arch-gallery__col-media"
                  onClick={() => openBoardGallery(item.board)}
                  onMouseEnter={() => setActiveCatIndex(idx)}
                  aria-label={`Open ${item.title} gallery`}
                >
                  <img
                    src={item.cover.src}
                    alt={`${item.title} showcase`}
                    loading="lazy"
                  />
                </button>

                <div className="arch-gallery__col-num">{numLabel}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Inside Gallery Modal (Spotlight Strip + 3-Column Visual Grid) */}
      <InsideGalleryModal
        isOpen={activeBoardModal !== null}
        categories={insideCategories}
        activeBoard={activeBoardModal || 'manipulations'}
        onSelectBoard={setActiveBoardModal}
        onClose={() => setActiveBoardModal(null)}
      />
    </section>
  );
}
