import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import type { PageType, ThemeMode } from '../../types';
import { soundEngine } from '../../services/soundEngine';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: PageType) => void;
  onToggleTheme: () => void;
  onToggleMusic: () => void;
  theme: ThemeMode;
}

interface CommandItem {
  id: string;
  category: 'Navigation' | 'Products' | 'Actions' | 'External';
  title: string;
  subtitle: string;
  icon: string;
  shortcut?: string;
  action: () => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
  onNavigate,
  onToggleTheme,
  onToggleMusic,
  theme
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Command items registry
  const commands: CommandItem[] = useMemo(
    () => [
      {
        id: 'nav-home',
        category: 'Navigation',
        title: 'Home',
        subtitle: 'Main landing page & cinematic hero',
        icon: 'mdi:home-variant-outline',
        action: () => onNavigate('home')
      },
      {
        id: 'nav-logic',
        category: 'Navigation',
        title: 'Logic & Systems (Engineering)',
        subtitle: 'Enterprise architectures, full-stack systems & skills',
        icon: 'mdi:code-braces',
        action: () => onNavigate('logic')
      },
      {
        id: 'nav-aesthetics',
        category: 'Navigation',
        title: 'Aesthetics & Motion (Creative)',
        subtitle: 'Cinematography reels, typography & graphic design',
        icon: 'mdi:palette-outline',
        action: () => onNavigate('aesthetics')
      },
      {
        id: 'nav-about',
        category: 'Navigation',
        title: 'About Pramuditha',
        subtitle: 'Background, degree, timeline & experience',
        icon: 'mdi:account-outline',
        action: () => onNavigate('about')
      },
      {
        id: 'prod-reminder',
        category: 'Products',
        title: 'reminder.afk (Desktop App)',
        subtitle: '3D ergonomic assistant with procedural chimes & companions',
        icon: 'mdi:robot-happy-outline',
        shortcut: 'Release v1.0',
        action: () => onNavigate('reminder')
      },
      {
        id: 'prod-localization',
        category: 'Products',
        title: 'Localization Check (VS Code Extension)',
        subtitle: 'Automated i18n & localization checker for developers',
        icon: 'mdi:code-tags-check',
        action: () => onNavigate('localization')
      },
      {
        id: 'act-music',
        category: 'Actions',
        title: 'Toggle Ambient Generative Music',
        subtitle: 'Synthesize soothing procedural soundscape chords',
        icon: 'mdi:music-note',
        action: () => onToggleMusic()
      },
      {
        id: 'act-theme',
        category: 'Actions',
        title: `Switch Theme to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`,
        subtitle: 'Toggle global color palette',
        icon: 'mdi:theme-light-dark',
        action: () => onToggleTheme()
      },
      {
        id: 'act-copy-email',
        category: 'Actions',
        title: 'Copy Email to Clipboard',
        subtitle: 'pramudithanadun@gmail.com',
        icon: 'mdi:email-fast-outline',
        action: () => {
          navigator.clipboard.writeText('pramudithanadun@gmail.com');
        }
      },
      {
        id: 'ext-github',
        category: 'External',
        title: 'GitHub Profile',
        subtitle: 'github.com/PramudithaN',
        icon: 'mdi:github',
        action: () => window.open('https://github.com/PramudithaN', '_blank')
      },
      {
        id: 'ext-linkedin',
        category: 'External',
        title: 'LinkedIn Profile',
        subtitle: 'linkedin.com/in/pramuditha-nadun',
        icon: 'mdi:linkedin',
        action: () => window.open('https://www.linkedin.com/in/pramuditha-nadun', '_blank')
      }
    ],
    [onNavigate, onToggleTheme, onToggleMusic, theme]
  );

  // Filter commands by search query
  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;
    const lower = query.toLowerCase();
    return commands.filter(
      (c) =>
        c.title.toLowerCase().includes(lower) ||
        c.subtitle.toLowerCase().includes(lower) ||
        c.category.toLowerCase().includes(lower)
    );
  }, [commands, query]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Keyboard navigation & global shortcuts (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        soundEngine.playClickSound();
        if (isOpen) onClose();
      }

      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        soundEngine.playHoverSound();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        soundEngine.playHoverSound();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          soundEngine.playClickSound();
          filteredCommands[selectedIndex].action();
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, filteredCommands, selectedIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="command-palette-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            className={`command-palette-dialog ${theme}-theme`}
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            {/* Search Input Bar */}
            <div className="command-input-wrapper">
              <Icon icon="mdi:magnify" className="search-icon" width="20" height="20" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search (e.g. 'logic', 'about', 'music', 'theme')..."
                className="command-input"
              />
              <span className="esc-hint">ESC</span>
            </div>

            {/* Results List */}
            <div className="command-results-list" role="listbox">
              {filteredCommands.length === 0 ? (
                <div className="command-empty-state">
                  <Icon icon="mdi:magnify-close" width="28" height="28" />
                  <p>No matching commands found for &ldquo;{query}&rdquo;</p>
                </div>
              ) : (
                filteredCommands.map((item, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        soundEngine.playClickSound();
                        item.action();
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`command-result-item ${isSelected ? 'selected' : ''}`}
                    >
                      <div className="item-icon-wrap">
                        <Icon icon={item.icon} width="18" height="18" />
                      </div>
                      <div className="item-info">
                        <span className="item-title">{item.title}</span>
                        <span className="item-subtitle">{item.subtitle}</span>
                      </div>
                      <div className="item-meta">
                        <span className="item-category">{item.category}</span>
                        {item.shortcut && <span className="item-shortcut">{item.shortcut}</span>}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Bar */}
            <div className="command-palette-footer">
              <div className="key-hints">
                <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
                <span><kbd>↵</kbd> Select</span>
                <span><kbd>ESC</kbd> Close</span>
              </div>
              <div className="footer-status">
                <span>Pramuditha.dev</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
