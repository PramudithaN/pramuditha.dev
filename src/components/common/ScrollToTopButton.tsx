import { Icon } from '@iconify/react';

interface ScrollToTopButtonProps {
  visible: boolean;
  onClick: () => void;
}

export default function ScrollToTopButton({ visible, onClick }: ScrollToTopButtonProps) {
  return (
    <button
      type="button"
      className={`subpage-scroll-top-btn${visible ? ' visible' : ''}`}
      onClick={onClick}
      title="Scroll to top"
      aria-label="Scroll to top"
    >
      <Icon icon="mdi:chevron-up" />
    </button>
  );
}
