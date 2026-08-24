import { useEffect, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from '@iconify/react'
import { type ShowcaseReel, defaultVideoReels } from '../services/contentStore'

const PINTEREST_USERNAME = 'ad0bep'
const BOARD_NAMES = ['all-pins', 'manipulations', 'flyers', 'social']

// Category labels for the filter tabs
const CATEGORY_LABELS: Record<string, string> = {
  'all-pins': 'All',
  'manipulations': 'Manipulations',
  'flyers': 'Flyers',
  'social': 'Social',
}

interface GalleryImage {
  src: string
  board: string
}

// ── Single grid image with its own skeleton + lazy load ──────────────────────
function GridImage({
  src,
  alt,
  onClick,
}: {
  src: string
  alt: string
  onClick: () => void
}) {
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)

  return (
    <div
      className={`showcase-grid-post${loaded ? ' grid-img-ready' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
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
          onError={() => { setLoaded(true); setErrored(true) }}
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
  )
}

// ── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({
  images,
  startIndex,
  onClose,
}: {
  images: GalleryImage[]
  startIndex: number
  onClose: () => void
}) {
  const [current, setCurrent] = useState(startIndex)
  const [imgLoaded, setImgLoaded] = useState(false)

  const prev = useCallback(() => {
    setImgLoaded(false)
    setCurrent(i => (i - 1 + images.length) % images.length)
  }, [images.length])

  const next = useCallback(() => {
    setImgLoaded(false)
    setCurrent(i => (i + 1) % images.length)
  }, [images.length])

  // Keyboard navigation + Escape to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose, prev, next])

  // Lock ALL scroll containers while lightbox is open, preserving scroll position
  useEffect(() => {
    const prevBodyOverflow = document.body.style.overflow
    const prevHtmlOverflow = document.documentElement.style.overflow
    const subpage = document.querySelector<HTMLElement>('.subpage-container')
    const prevSubpageOverflow = subpage ? subpage.style.overflow : ''
    const savedScrollTop = subpage ? subpage.scrollTop : 0

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    if (subpage) {
      subpage.style.overflow = 'hidden'
      // Restoring scrollTop after hiding overflow keeps the visual position intact
      subpage.scrollTop = savedScrollTop
    }

    return () => {
      document.body.style.overflow = prevBodyOverflow
      document.documentElement.style.overflow = prevHtmlOverflow
      if (subpage) {
        subpage.style.overflow = prevSubpageOverflow
        subpage.scrollTop = savedScrollTop
      }
    }
  }, [])

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
          onClick={e => { e.stopPropagation(); prev() }}
          aria-label="Previous image"
        >
          <Icon icon="mdi:chevron-left" />
        </button>
      )}

      {/* Image */}
      <div className="lightbox-img-wrap" onClick={e => e.stopPropagation()}>
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
          onClick={e => { e.stopPropagation(); next() }}
          aria-label="Next image"
        >
          <Icon icon="mdi:chevron-right" />
        </button>
      )}
    </div>,
    document.body
  )
}

// ── Main component ────────────────────────────────────────────────────────────
interface VideoShowcaseProps {
  reels?: ShowcaseReel[]
}

export default function VideoShowcase({ reels }: VideoShowcaseProps) {
  const videoReels = reels && reels.length > 0 ? reels : defaultVideoReels
  const [activeVideoIndex, setActiveVideoIndex] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  const safeIndex = Math.min(activeVideoIndex, Math.max(0, videoReels.length - 1))
  const activeVideo = videoReels[safeIndex] || defaultVideoReels[0]

  // Gallery state: per-board images + loading map
  const [allImages, setAllImages] = useState<GalleryImage[]>([])
  const [loadingBoards, setLoadingBoards] = useState<Record<string, boolean>>(
    Object.fromEntries(BOARD_NAMES.map(b => [b, true]))
  )
  const [activeCategory, setActiveCategory] = useState<string>('all-pins')

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxStart, setLightboxStart] = useState(0)

  useEffect(() => {
    const fetchBoard = async (board: string) => {
      const rssName = board === 'all-pins' ? 'feed' : board
      const rawUrl = `https://www.pinterest.com/${PINTEREST_USERNAME}/${rssName}.rss`
      const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rawUrl)}`

      try {
        const res = await fetch(proxyUrl)
        if (!res.ok) return
        const data = await res.json()
        if (data.status !== 'ok') return

        const imgs: GalleryImage[] = []
        data.items.forEach((item: any) => {
          const match = item.description.match(/<img[^>]+src=["']([^"']+)["']/i)
          if (match) {
            const src = match[1].replace(/\/\d+x\//, '/originals/')
            imgs.push({ src, board })
          }
        })

        setAllImages(prev => {
          const existing = new Set(prev.map(i => i.src))
          const fresh = imgs.filter(i => !existing.has(i.src))
          return [...prev, ...fresh]
        })
      } catch {
        // silently ignore per-board errors
      } finally {
        setLoadingBoards(prev => ({ ...prev, [board]: false }))
      }
    }

    BOARD_NAMES.forEach(fetchBoard)
  }, [])

  const isLoading = Object.values(loadingBoards).some(Boolean)

  // Filtered images for the active category tab
  const filteredImages =
    activeCategory === 'all-pins'
      ? allImages
      : allImages.filter(img => img.board === activeCategory)

  const openLightbox = (index: number) => {
    setLightboxStart(index)
    setLightboxOpen(true)
  }

  const videoTrackRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)
  const isMouseDownRef = useRef(false)
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)
  const [isGrabbing, setIsGrabbing] = useState(false)

  const selectVideoReel = (index: number) => {
    setActiveVideoIndex(index)
    setIsVideoPlaying(false)

    const track = videoTrackRef.current
    if (!track) return
    const cards = track.querySelectorAll('.showcase-card')
    const targetCard = cards[index] as HTMLElement | undefined
    if (targetCard) {
      const scrollLeft = targetCard.offsetLeft - track.offsetWidth / 2 + targetCard.offsetWidth / 2
      track.scrollTo({ left: scrollLeft, behavior: 'smooth' })
    }
  }

  // Mouse drag handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    const track = videoTrackRef.current
    if (!track) return
    isMouseDownRef.current = true
    isDraggingRef.current = false
    startXRef.current = e.pageX - track.offsetLeft
    scrollLeftRef.current = track.scrollLeft
    setIsGrabbing(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current) return
    const track = videoTrackRef.current
    if (!track) return
    e.preventDefault()
    const x = e.pageX - track.offsetLeft
    const walk = (x - startXRef.current) * 1.4
    if (Math.abs(walk) > 5) {
      isDraggingRef.current = true
    }
    track.scrollLeft = scrollLeftRef.current - walk
  }

  const handleMouseUpOrLeave = () => {
    if (!isMouseDownRef.current) return
    isMouseDownRef.current = false
    setIsGrabbing(false)
    setTimeout(() => {
      isDraggingRef.current = false
    }, 60)
  }

  const handleCardClick = (index: number) => {
    if (isDraggingRef.current) return
    selectVideoReel(index)
  }

  // Mouse wheel horizontal scroll conversion
  useEffect(() => {
    const track = videoTrackRef.current
    if (!track) return

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0 && track.scrollWidth > track.clientWidth) {
        e.preventDefault()
        track.scrollLeft += e.deltaY * 0.85
      }
    }

    track.addEventListener('wheel', handleWheel, { passive: false })
    return () => track.removeEventListener('wheel', handleWheel)
  }, [])

  const scrollVideoRelated = (direction: 'left' | 'right') => {
    const nextIndex =
      direction === 'left'
        ? Math.max(0, activeVideoIndex - 1)
        : Math.min(videoReels.length - 1, activeVideoIndex + 1)

    selectVideoReel(nextIndex)
  }

  const getYouTubeEmbedUrl = (url: string): string | null => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^?&/]+)/)
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : null
  }

  const isYouTube = (url: string) => /youtu\.?be/.test(url)

  const videoTouchStartX = useRef(0)
  const videoTouchEndX = useRef(0)

  const handleVideoTouchStart = (e: React.TouchEvent) => {
    videoTouchStartX.current = e.touches[0].clientX
    videoTouchEndX.current = e.touches[0].clientX
  }

  const handleVideoTouchMove = (e: React.TouchEvent) => {
    videoTouchEndX.current = e.touches[0].clientX
  }

  const handleVideoTouchEnd = () => {
    const diff = videoTouchStartX.current - videoTouchEndX.current
    if (Math.abs(diff) > 40) {
      scrollVideoRelated(diff > 0 ? 'right' : 'left')
    }
  }

  return (
    <div className="video-showcase">

      {/* ── Graphic Design Description ───────────────────────────────── */}
      <p className="showcase-intro">
       I'm Pramuditha Nadun, a graphic designer with a Fiverr journey that began in 2020. Since then, I've helped clients bring their visions to life through detailed Photoshop editing, distinctive logo design, and end-to-end graphic design work turning simple briefs into visuals that leave an impression.
      </p>

      {/* ── Category filter tabs ─────────────────────────────────────── */}
      <div className="gallery-filter-bar">
        {BOARD_NAMES.map(board => (
          <button
            key={board}
            type="button"
            className={`gallery-filter-tab${activeCategory === board ? ' active' : ''}`}
            onClick={() => setActiveCategory(board)}
          >
            {CATEGORY_LABELS[board]}
          </button>
        ))}
      </div>

      {/* ── Pinterest image grid ─────────────────────────────────────── */}
      {isLoading && filteredImages.length === 0 ? (
        // Full skeleton grid while all boards are still loading
        <div className="showcase-instagram-grid">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="showcase-grid-post">
              <div className="grid-img-skeleton" />
            </div>
          ))}
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="gallery-empty">
          <Icon icon="mdi:image-off-outline" />
          <span>No images in this category yet</span>
        </div>
      ) : (
        <div className="showcase-instagram-grid">
          {filteredImages.map((img, i) => (
            <GridImage
              key={img.src}
              src={img.src}
              alt={CATEGORY_LABELS[img.board]}
              onClick={() => openLightbox(i)}
            />
          ))}
        </div>
      )}

      {/* ── Video editing section ────────────────────────────────────── */}
      <div className="showcase-section-break">
        <span>Video Editing</span>
      </div>
      
      <p className="showcase-intro">
      Alongside design, I work as a video editor skilled in After Effects, Premiere Pro, and CapCut. My focus lies in VFX, short-form content, and cinematic edits crafting videos that don't just look good, but hold attention and tell a story.
      </p>

      <div className="showcase-hero">

        <div className="showcase-media-area">
          {isVideoPlaying ? (
            <>
              {isYouTube(activeVideo.videoUrl) ? (
                <iframe
                  key={activeVideo.id}
                  className="showcase-video-el"
                  src={getYouTubeEmbedUrl(activeVideo.videoUrl)!}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ border: 'none' }}
                />
              ) : (
                <video
                  key={activeVideo.id}
                  className="showcase-video-el"
                  src={activeVideo.videoUrl}
                  controls
                  autoPlay
                  onEnded={() => setIsVideoPlaying(false)}
                />
              )}
              <button
                type="button"
                className="showcase-close-btn"
                onClick={() => setIsVideoPlaying(false)}
                aria-label="Close video"
              >
                <Icon icon="mdi:close" />
              </button>
            </>
          ) : (
            <>
              <img
                className="showcase-thumbnail"
                src={activeVideo.thumbnail}
                alt={activeVideo.title}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src.includes('maxresdefault.jpg')) {
                    target.src = target.src.replace('maxresdefault.jpg', 'sddefault.jpg');
                  } else if (target.src.includes('sddefault.jpg')) {
                    target.src = target.src.replace('sddefault.jpg', 'hqdefault.jpg');
                  } else if (target.src.includes('hqdefault.jpg')) {
                    target.src = target.src.replace('hqdefault.jpg', 'mqdefault.jpg');
                  }
                }}
              />
              <div className="showcase-overlay-gradient" />
              <div className="showcase-play-wrap">
                <span className="showcase-duration">{activeVideo.duration}</span>
                <button
                  type="button"
                  className="showcase-play-btn"
                  onClick={() => setIsVideoPlaying(true)}
                  aria-label={`Play ${activeVideo.title}`}
                >
                  <Icon icon="mdi:play" />
                </button>
              </div>
            </>
          )}
        </div>

        <div className={`showcase-bottom${isVideoPlaying ? ' is-playing' : ''}`}>
          <div className="showcase-info">
            <div className="showcase-tags">
              {activeVideo.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <h3 className="showcase-title">{activeVideo.title}</h3>
            <p className="showcase-credit">
              <strong>{activeVideo.year}</strong> &nbsp;|&nbsp; <strong>{activeVideo.role}</strong>
            </p>
            <p className="showcase-desc">{activeVideo.description}</p>
          </div>

          <div className="showcase-related">
            <div className="showcase-related-header">
              <span>On Next</span>
              <div className="showcase-related-nav">
                <button type="button" onClick={() => scrollVideoRelated('left')} aria-label="Scroll left">
                  <Icon icon="mdi:chevron-left" />
                </button>
                <button type="button" onClick={() => scrollVideoRelated('right')} aria-label="Scroll right">
                  <Icon icon="mdi:chevron-right" />
                </button>
              </div>
            </div>
            <div
              className={`showcase-related-track${isGrabbing ? ' is-grabbing' : ''}`}
              ref={videoTrackRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              onTouchStart={handleVideoTouchStart}
              onTouchMove={handleVideoTouchMove}
              onTouchEnd={handleVideoTouchEnd}
            >
              {videoReels.map((reel, index) => (
                <button
                  type="button"
                  key={reel.id}
                  className={`showcase-card${index === activeVideoIndex ? ' active' : ''}`}
                  onClick={() => handleCardClick(index)}
                >
                  <img
                    src={reel.thumbnail}
                    alt={reel.title}
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src.includes('maxresdefault.jpg')) {
                        target.src = target.src.replace('maxresdefault.jpg', 'sddefault.jpg');
                      } else if (target.src.includes('sddefault.jpg')) {
                        target.src = target.src.replace('sddefault.jpg', 'hqdefault.jpg');
                      } else if (target.src.includes('hqdefault.jpg')) {
                        target.src = target.src.replace('hqdefault.jpg', 'mqdefault.jpg');
                      }
                    }}
                  />
                  <span>{reel.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Tools & Software Section ────────────────────────────────────── */}
      <div className="showcase-section-break" style={{ marginTop: '4rem' }}>
        <span>Software & Tools</span>
      </div>
      
      <div className="skills-gallery" style={{ marginTop: '2.5rem', marginBottom: '2rem' }}>
        <div className="skills-gallery-item">
          <Icon icon="simple-icons:adobephotoshop" className="skills-gallery-icon" />
          <span className="skills-gallery-text">Photoshop</span>
        </div>
        <div className="skills-gallery-item">
          <Icon icon="simple-icons:adobeillustrator" className="skills-gallery-icon" />
          <span className="skills-gallery-text">Illustrator</span>
        </div>
        <div className="skills-gallery-item">
          <Icon icon="simple-icons:adobeaftereffects" className="skills-gallery-icon" />
          <span className="skills-gallery-text">After Effects</span>
        </div>
        <div className="skills-gallery-item">
          <Icon icon="simple-icons:adobepremierepro" className="skills-gallery-icon" />
          <span className="skills-gallery-text">Premiere Pro</span>
        </div>
        <div className="skills-gallery-item">
          <Icon icon="simple-icons:adobelightroom" className="skills-gallery-icon" />
          <span className="skills-gallery-text">Lightroom</span>
        </div>
        <div className="skills-gallery-item">
          <Icon icon="thesvg:capcut" className="skills-gallery-icon" />
          <span className="skills-gallery-text">CapCut</span>
        </div>
      </div>

      {/* ── Lightbox ─────────────────────────────────────────────────── */}
      {lightboxOpen && (
        <Lightbox
          images={filteredImages}
          startIndex={lightboxStart}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  )
}