import type { RefObject } from 'react';
import type { PageType, ThemeMode } from '../../types';
import HomeMorphStage from '../home/HomeMorphStage';

interface HomeViewProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onNavigate: (page: PageType) => void;
  section2Ref?: RefObject<HTMLElement | null>;
  onOpenSearch?: () => void;
}

export default function HomeView({
  theme,
  onToggleTheme,
  onNavigate,
  onOpenSearch
}: HomeViewProps) {
  return (
    <HomeMorphStage
      theme={theme}
      onToggleTheme={onToggleTheme}
      onNavigate={onNavigate}
      onOpenSearch={onOpenSearch}
    />
  );
}
