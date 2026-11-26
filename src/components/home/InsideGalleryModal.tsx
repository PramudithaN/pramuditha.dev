import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Expand, X } from 'lucide-react';
import type { GalleryImage } from '../showcase/Lightbox';
import Lightbox from '../showcase/Lightbox';
import './inside-gallery-modal.css';

export interface InsideGalleryCategory {
  board: string;
  title: string;
  images: GalleryImage[];
}

export interface InsideGalleryModalProps {
  isOpen: boolean;
  categories: InsideGalleryCategory[];
  activeBoard: string;
  onSelectBoard: (board: string) => void;
  onClose: () => void;
}

const BOARD_DESCRIPTIONS: Record<string, string> = {
  manipulations:
    'Layered photo composite exploring directional lighting, depth, and atmospheric visual storytelling.',
  flyers:
    'Editorial poster and key-visual layout crafted with bold typographic hierarchy and print-ready contrast.',
  logos:
    'Minimalist geometric identity mark engineered for clean scalability across digital and physical media.',
  social:
    'High-contrast digital campaign creative tailored for crisp, scroll-stopping visual engagement.',
};

function getBoardDescription(board?: string): string {
  if (!board) return BOARD_DESCRIPTIONS.manipulations;
  return (
    BOARD_DESCRIPTIONS[board.toLowerCase()] ||
    'Curated visual design study from Pramuditha Nadun’s creative archive.'
  );
}

export default function InsideGalleryModal({
  isOpen,
  categories,
  activeBoard,
  onSelectBoard,
  onClose,
}: InsideGalleryModalProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const wheelAccumRef = useRef(0);
  const wheelLockRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);

  const currentCatIdx = Math.max(
    0,
    categories.findIndex((c) => c.board === activeBoard)
  );
  const currentCat = categories[currentCatIdx] || categories[0];
  const images = currentCat?.images ?? [];
  const total = images.length;
  const safeIndex = total > 0 ? ((activeIndex % total) + total) % total : 0;
  const centerImage = images[safeIndex];

  useEffect(() => {
    setActiveIndex(0);
    setLightboxIndex(null);
    wheelAccumRef.current = 0;
  }, [activeBoard, isOpen]);

  const stepImage = useCallback(
    (dir: 1 | -1) => {
      if (total === 0) return;
      if (dir === 1 && safeIndex === total - 1 && categories.length > 1) {
        const nextCat = categories[(currentCatIdx + 1) % categories.length];
        onSelectBoard(nextCat.board);
        return;
      }
      if (dir === -1 && safeIndex === 0 && categories.length > 1) {
        const prevCat =
          categories[(currentCatIdx - 1 + categories.length) % categories.length];
        onSelectBoard(prevCat.board);
        return;
      }
      setActiveIndex((prev) => (prev + dir + total) % total);
    },
    [total, safeIndex, categories, currentCatIdx, onSelectBoard]
  );

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex !== null) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        stepImage(1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        stepImage(-1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, lightboxIndex, stepImage, onClose]);

  if (!isOpen || !currentCat || !centerImage) return null;

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (lightboxIndex !== null || wheelLockRef.current) return;

    wheelAccumRef.current += e.deltaY;
    if (Math.abs(wheelAccumRef.current) >= 70) {
      const dir: 1 | -1 = wheelAccumRef.current > 0 ? 1 : -1;
      wheelAccumRef.current = 0;
      wheelLockRef.current = true;
      stepImage(dir);
      window.setTimeout(() => {
        wheelLockRef.current = false;
      }, 250);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartYRef.current = e.touches[0]?.clientY ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartYRef.current === null) return;
    const endY = e.changedTouches[0]?.clientY ?? touchStartYRef.current;
    const deltaY = touchStartYRef.current - endY;
    touchStartYRef.current = null;
    if (Math.abs(deltaY) > 40) {
      stepImage(deltaY > 0 ? 1 : -1);
    }
  };

  const sectionNum = String(currentCatIdx + 1).padStart(2, '0');
  const itemNum = String(safeIndex + 1).padStart(2, '0');
  const totalNum = String(total).padStart(2, '0');
  const progressPct = total > 1 ? ((safeIndex + 1) / total) * 100 : 100;
  const pieceCategory = centerImage.board || currentCat.board;

  // Ensure the background grid always has enough tiles to fill the stage cleanly
  const gridTiles = Array.from(
    { length: Math.max(total, 24) },
    (_, slotIdx) => {
      const imgIdx = slotIdx % total;
      return {
        img: images[imgIdx],
        imgIdx,
        slotIdx,
      };
    }
  );

  return (
    <div
      className="orbital-gallery-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`${currentCat.title} Gallery`}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Section Tabs & Prominent Close */}
      <header className="orbital-gallery__header">
        <nav className="orbital-gallery__sections" role="tablist" aria-label="Gallery sections">
          {categories.map((cat, idx) => (
            <button
              key={cat.board}
              type="button"
              role="tab"
              aria-selected={cat.board === currentCat.board}
              className={`orbital-gallery__section-btn ${
                cat.board === currentCat.board ? 'is-active' : ''
              }`}
              onClick={() => onSelectBoard(cat.board)}
            >
              <span className="orbital-gallery__section-idx">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <span>{cat.title}</span>
            </button>
          ))}
        </nav>

        <button
          type="button"
          className="orbital-gallery__close"
          onClick={onClose}
          aria-label="Close gallery"
        >
          <X size={15} strokeWidth={2.3} />
          <span>Close</span>
        </button>
      </header>

      {/* Center Stage: Seamless Background Grid + Progressive Edge Blur + Main Center Image */}
      <main className="orbital-gallery__stage">
        {/* Seamless Full-Stage Background Grid of Category Images */}
        <div className="orbital-gallery__bg-grid">
          {gridTiles.map(({ img, imgIdx, slotIdx }) => (
            <button
              key={`${img.src}-${slotIdx}`}
              type="button"
              className={`orbital-gallery__grid-item ${
                imgIdx === safeIndex ? 'is-active' : ''
              }`}
              onClick={() => setActiveIndex(imgIdx)}
              aria-label={`Load image ${imgIdx + 1} into center`}
            >
              <img
                src={img.src}
                alt={`${currentCat.title} ${imgIdx + 1}`}
                loading="lazy"
              />
            </button>
          ))}
        </div>

        {/* Progressive Edge Blur & Vignette Overlay */}
        <div className="orbital-gallery__edge-blur" aria-hidden="true" />

        {/* Main Center Image + Category & Image Description */}
        <div
          className="orbital-gallery__center-wrap"
          key={`${currentCat.board}-${safeIndex}`}
        >
          <button
            type="button"
            className="orbital-gallery__center"
            onClick={() => setLightboxIndex(safeIndex)}
            aria-label={`Open ${currentCat.title} image ${itemNum} fullscreen`}
          >
            <img src={centerImage.src} alt={`${currentCat.title} ${itemNum}`} />
            <div className="orbital-gallery__center-overlay">
              <span className="orbital-gallery__center-tag">
                {sectionNum} / {itemNum}
              </span>
              <span className="orbital-gallery__center-expand" aria-hidden="true">
                <Expand size={14} />
              </span>
            </div>
          </button>

          <div className="orbital-gallery__caption">
            <div className="orbital-gallery__caption-top">
              <span className="orbital-gallery__caption-cat">
                {pieceCategory.toUpperCase()}
              </span>
              <span className="orbital-gallery__caption-id">
                Piece #{itemNum}
              </span>
            </div>
            <p className="orbital-gallery__caption-desc">
              {getBoardDescription(pieceCategory)}
            </p>
          </div>
        </div>
      </main>

      {/* Bottom Section Info, Progress Scrubber & Arrow Controls */}
      <footer className="orbital-gallery__footer">
        <div className="orbital-gallery__meta">
          <span className="orbital-gallery__sec-label">
            SECTION {sectionNum} &mdash; {currentCat.title.toUpperCase()}
          </span>
          <span className="orbital-gallery__scroll-hint">
            Scroll wheel or click any surrounding frame to bring it into focus
          </span>
        </div>

        <div className="orbital-gallery__controls">
          <div className="orbital-gallery__progress" aria-hidden="true">
            <span
              className="orbital-gallery__progress-bar"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <button
            type="button"
            className="orbital-gallery__arrow"
            onClick={() => stepImage(-1)}
            aria-label="Previous image"
          >
            <ArrowLeft size={16} />
          </button>
          <span className="orbital-gallery__counter">
            {itemNum} / {totalNum}
          </span>
          <button
            type="button"
            className="orbital-gallery__arrow"
            onClick={() => stepImage(1)}
            aria-label="Next image"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </footer>

      {lightboxIndex !== null && (
        <Lightbox
          isOpen
          images={images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}
