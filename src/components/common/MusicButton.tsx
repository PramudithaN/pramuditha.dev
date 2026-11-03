import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';

interface MusicButtonProps {
  variant?: 'header' | 'floating';
}

export default function MusicButton({ variant = 'header' }: MusicButtonProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(soundEngine.getIsMusicPlaying());

  useEffect(() => {
    const unsubscribe = soundEngine.subscribe((playing) => {
      setIsPlaying(playing);
    });
    return unsubscribe;
  }, []);

  const handleToggle = () => {
    soundEngine.playClickSound();
    soundEngine.toggleMusic();
  };

  const title = isPlaying ? 'Pause Ambient Generative Music' : 'Play Ambient Generative Music';

  if (variant === 'floating') {
    return (
      <button
        type="button"
        className={`floating-theme-btn floating-music-btn ${isPlaying ? 'playing' : ''}`}
        onClick={handleToggle}
        title={title}
        aria-label={title}
      >
        {isPlaying ? (
          <span className="music-bars" aria-hidden="true">
            <span className="music-bar bar-1" />
            <span className="music-bar bar-2" />
            <span className="music-bar bar-3" />
          </span>
        ) : (
          <VolumeX size={15} />
        )}
        <span>{isPlaying ? 'Music ON' : 'Music'}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`theme-mode-toggle-btn header-music-btn ${isPlaying ? 'playing' : ''}`}
      onClick={handleToggle}
      title={title}
      aria-label={title}
    >
      {isPlaying ? (
        <span className="music-bars" aria-hidden="true">
          <span className="music-bar bar-1" />
          <span className="music-bar bar-2" />
          <span className="music-bar bar-3" />
        </span>
      ) : (
        <Volume2 size={16} />
      )}
    </button>
  );
}
