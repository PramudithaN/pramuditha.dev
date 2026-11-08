import { motion, AnimatePresence } from 'motion/react';
import { Icon } from '@iconify/react';
import { springs } from '../../constants/motion';

interface ScrollToTopButtonProps {
  visible: boolean;
  onClick: () => void;
}

export default function ScrollToTopButton({ visible, onClick }: ScrollToTopButtonProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          className="subpage-scroll-top-btn visible"
          initial={{ scale: 0, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0, opacity: 0, y: 12 }}
          whileHover={{ scale: 1.12, y: -2 }}
          whileTap={{ scale: 0.92 }}
          transition={springs.snappy}
          onClick={onClick}
          title="Scroll to top"
          aria-label="Scroll to top"
        >
          <Icon icon="mdi:chevron-up" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
