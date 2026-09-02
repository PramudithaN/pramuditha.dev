import { useState, type RefObject } from 'react';
import { Icon } from '@iconify/react';
import type { PageType, ThemeMode } from '../../types';
import SubpageHeader from '../common/SubpageHeader';
import ScrollToTopButton from '../common/ScrollToTopButton';
import Companion3DViewer from '../showcase/Companion3DViewer';
import { useScrollTop } from '../../hooks/useScrollTop';

interface ReminderReleaseViewProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onNavigate: (page: PageType) => void;
  subpageRef: RefObject<HTMLDivElement | null>;
}

const REPO_URL = 'https://github.com/PramudithaN/reminder.afk';
const RELEASE_TAG_URL = 'https://github.com/PramudithaN/reminder.afk/releases/tag/v1.0.0';
const RELEASE_ZIP_URL = 'https://github.com/PramudithaN/reminder.afk/archive/refs/tags/v1.0.0.zip';
const CLONE_CMD = 'git clone https://github.com/PramudithaN/reminder.afk.git';

export default function ReminderReleaseView({
  theme,
  onToggleTheme,
  onNavigate,
  subpageRef
}: ReminderReleaseViewProps) {
  const { showScrollTop, scrollToTop } = useScrollTop('reminder', subpageRef);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [activeCompanion, setActiveCompanion] = useState<'robot' | 'spiderman' | 'venom'>('robot');
  const [trayPreviewMuted, setTrayPreviewMuted] = useState(false);

  const handleCopyClone = async () => {
    try {
      await navigator.clipboard.writeText(CLONE_CMD);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  // Direct download handler: queries GitHub release assets for .exe or downloads release package directly to system
  const handleDirectDownload = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setDownloading(true);

    try {
      // 1. Check if direct local exe is available in public/
      const localCheck = await fetch('/reminder.afk-Windows-1.0.0-Setup.exe', { method: 'HEAD' }).catch(() => null);
      if (localCheck && localCheck.ok) {
        const a = document.createElement('a');
        a.href = '/reminder.afk-Windows-1.0.0-Setup.exe';
        a.download = 'reminder.afk-Windows-1.0.0-Setup.exe';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
      }

      // 2. Check if GitHub release has an uploaded .exe asset
      const res = await fetch('https://api.github.com/repos/PramudithaN/reminder.afk/releases/latest').catch(() => null);
      if (res && res.ok) {
        const releaseData = await res.json();
        const exeAsset = releaseData.assets?.find((a: { name: string; browser_download_url: string }) =>
          a.name.toLowerCase().endsWith('.exe')
        );

        if (exeAsset?.browser_download_url) {
          const a = document.createElement('a');
          a.href = exeAsset.browser_download_url;
          a.download = exeAsset.name;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          return;
        }
      }

      // 3. Direct GitHub Release Package download (triggers immediate browser download directly to disk)
      const a = document.createElement('a');
      a.href = RELEASE_ZIP_URL;
      a.download = 'reminder.afk-v1.0.0.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      const a = document.createElement('a');
      a.href = RELEASE_ZIP_URL;
      a.download = 'reminder.afk-v1.0.0.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setTimeout(() => setDownloading(false), 1200);
    }
  };

  const companions = [
    {
      id: 'robot' as const,
      name: 'Cyber Sentinel',
      tag: 'Default Companion',
      modelUrl: '/robot.glb',
      desc: 'Sleek mechanical companion with real-time idle skeletal loops and soft optical scan pulses.',
      icon: 'mdi:robot-outline'
    },
    {
      id: 'spiderman' as const,
      name: 'Spider-Man',
      tag: 'Hero Break',
      modelUrl: '/spiderman.glb',
      desc: 'Acrobatic superhero model designed to bring energetic posture reminders to your screen.',
      icon: 'mdi:spider-web'
    },
    {
      id: 'venom' as const,
      name: 'Venom',
      tag: 'Symbiote Stance',
      modelUrl: '/venom.glb',
      desc: 'High-presence character model with dramatic stance to instantly break deep screen fixation.',
      icon: 'mdi:virus-outline'
    }
  ];

  const currentCompanion = companions.find((c) => c.id === activeCompanion) || companions[0];

  return (
    <>
      <div
        ref={subpageRef as RefObject<HTMLDivElement>}
        className={`subpage-container reminder-subpage ${theme}-theme`}
      >
        <div className="subpage-scroll-content">
          {/* Subpage Background Watermark */}
          <div className="subpage-bg-watermark right-watermark">
            <span>PRAMUDITH NADUN | REMINDER.AFK</span>
          </div>

          {/* Top Header: PRNA (Left) | Releases Center Text (Middle) | Theme Toggle (Right Corner) */}
          <SubpageHeader
            theme={theme}
            onToggleTheme={onToggleTheme}
            onNavigateHome={() => onNavigate('home')}
            onBack={() => onNavigate('home')}
            currentPage="reminder"
            onNavigate={onNavigate}
            hideNav={true}
            hideBack={true}
            centerText="Releases | Scroll down for more info"
          />

          {/* Subpage Title & Subtitle matching site hierarchy */}
          <h1 className="subpage-title">reminder.afk</h1>
          <p className="subpage-subtitle">3D Desktop Break Assistant · v1.0.0 Release</p>

          <div className="reminder-content-wrapper">
            {/* Main Product Hero Card */}
            <div className="reminder-hero-card">
              <div className="reminder-hero-topbar">
                <div className="release-badge-pill">
                  <span className="badge-pulse-dot" />
                  <span>v1.0.0 Official Release</span>
                </div>
                <span className="release-platform-tag">
                  <Icon icon="mdi:microsoft-windows" width="14" height="14" />
                  <span>Windows 10 / 11</span>
                </span>
                <span className="release-license-tag">
                  <Icon icon="mdi:license" width="14" height="14" />
                  <span>MIT License</span>
                </span>
              </div>

              <h2 className="reminder-card-headline">
                Combat Workstation Fatigue with 3D Companions
              </h2>

              <p className="reminder-card-desc">
                An interactive desktop ergonomic break assistant engineered for developers, designers, and power users.
                Built with <strong>Electron</strong>, <strong>React 19</strong>, and <strong>React Three Fiber</strong>,
                reminder.afk mitigates digital eye strain following the 20-20-20 rule and prevents sedentary stiffness with
                interactive 3D character overlays.
              </p>

              {/* Action Buttons with Direct Download */}
              <div className="reminder-hero-actions">
                <button
                  type="button"
                  onClick={handleDirectDownload}
                  className="reminder-primary-btn"
                  title="Download reminder.afk Windows release directly to your system"
                >
                  <Icon icon={downloading ? 'mdi:loading' : 'mdi:download'} className={downloading ? 'spin-icon' : 'btn-icon'} />
                  <span>{downloading ? 'Downloading...' : 'Download .exe (v1.0.0)'}</span>
                </button>

                <a
                  href={REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="reminder-secondary-btn"
                  title="View GitHub Repository"
                >
                  <Icon icon="mdi:github" className="btn-icon" />
                  <span>GitHub Repository</span>
                </a>

                <button
                  type="button"
                  className="reminder-clone-pill-btn"
                  onClick={handleCopyClone}
                  title="Copy git clone command"
                >
                  <Icon icon={copied ? 'mdi:check' : 'mdi:content-copy'} width="14" height="14" />
                  <span className="clone-code-text">{copied ? 'Copied clone command!' : 'git clone reminder.afk'}</span>
                </button>
              </div>

              {/* Tech Stack Tags */}
              <div className="reminder-tech-stack-row">
                <span className="reminder-tech-tag">
                  <Icon icon="logos:electron" width="14" /> Electron
                </span>
                <span className="reminder-tech-tag">
                  <Icon icon="logos:react" width="14" /> React 19
                </span>
                <span className="reminder-tech-tag">
                  <Icon icon="logos:threejs" width="14" /> Three.js / R3F
                </span>
                <span className="reminder-tech-tag">
                  <Icon icon="logos:typescript-icon" width="14" /> TypeScript
                </span>
                <span className="reminder-tech-tag">
                  <Icon icon="logos:vitejs" width="14" /> Vite
                </span>
              </div>
            </div>

            {/* Core Capabilities Grid */}
            <div className="section-divider" />
            <h2 className="section-title">Core Capabilities</h2>
            <p className="skills-subtitle">Ergonomic interrupt protocols for daily focus &amp; health:</p>

            <div className="reminder-features-grid">
              <div className="reminder-feature-card">
                <div className="feature-card-icon-wrap">
                  <Icon icon="mdi:eye-outline" className="feature-card-icon" />
                </div>
                <div className="feature-meta">01 / OPTICAL HEALTH</div>
                <h3 className="feature-title">20-20-20 Fatigue Protocol</h3>
                <p className="feature-desc">
                  Every 20 minutes, prompts you to look at an object 20 feet away for 20 seconds to relax your eye muscles and eliminate digital fatigue.
                </p>
                <div className="feature-tag-list">
                  <span>Ophthalmologist Backed</span>
                  <span>Soft Chime</span>
                </div>
              </div>

              <div className="reminder-feature-card">
                <div className="feature-card-icon-wrap">
                  <Icon icon="mdi:cube-outline" className="feature-card-icon" />
                </div>
                <div className="feature-meta">02 / 3D RENDERING</div>
                <h3 className="feature-title">Interactive 3D Companions</h3>
                <p className="feature-desc">
                  Animated 3D characters rendered in a smooth transparent window overlay. Click and drag anywhere to inspect and rotate in 3D space.
                </p>
                <div className="feature-tag-list">
                  <span>React Three Fiber</span>
                  <span>Orbit Controls</span>
                </div>
              </div>

              <div className="reminder-feature-card">
                <div className="feature-card-icon-wrap">
                  <Icon icon="mdi:human-handsup" className="feature-card-icon" />
                </div>
                <div className="feature-meta">03 / PHYSICAL POSTURE</div>
                <h3 className="feature-title">Sedentary Posture Alerts</h3>
                <p className="feature-desc">
                  Scheduled stretch reminders encourage standing, spinal realignment, and blood circulation during prolonged coding sessions.
                </p>
                <div className="feature-tag-list">
                  <span>Posture Reset</span>
                  <span>Custom Intervals</span>
                </div>
              </div>

              <div className="reminder-feature-card">
                <div className="feature-card-icon-wrap">
                  <Icon icon="mdi:tray-full" className="feature-card-icon" />
                </div>
                <div className="feature-meta">04 / ARCHITECTURE</div>
                <h3 className="feature-title">System Tray Service</h3>
                <p className="feature-desc">
                  Runs silently in the Windows system tray with single-instance locking and single-click sound mute.
                </p>

                {/* Interactive Active & Muted Tray representation */}
                <div className="tray-status-toggle-row">
                  <button
                    type="button"
                    className={`tray-toggle-pill ${!trayPreviewMuted ? 'active' : ''}`}
                    onClick={() => setTrayPreviewMuted(false)}
                  >
                    <img src="/trayIconAFK.png" alt="Active" width="14" height="14" />
                    <span>Active Tray</span>
                  </button>
                  <button
                    type="button"
                    className={`tray-toggle-pill ${trayPreviewMuted ? 'active' : ''}`}
                    onClick={() => setTrayPreviewMuted(true)}
                  >
                    <img src="/mutedTrayIconAFK.png" alt="Muted" width="14" height="14" />
                    <span>Muted Tray</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive 3D Companions Section using actual .glb models */}
            <div className="section-divider" />
            <h2 className="section-title">Interactive 3D Companions</h2>
            <p className="skills-subtitle">Select a character below to preview and rotate the real 3D model in real time:</p>

            <div className="companion-tabs-row">
              {companions.map((comp) => (
                <button
                  key={comp.id}
                  type="button"
                  className={`companion-tab-btn ${activeCompanion === comp.id ? 'active' : ''}`}
                  onClick={() => setActiveCompanion(comp.id)}
                >
                  <Icon icon={comp.icon} width="16" height="16" />
                  <span>{comp.name}</span>
                </button>
              ))}
            </div>

            <div className="companion-display-card">
              <div className="companion-info-pane">
                <span className="companion-tag-badge">
                  {currentCompanion.tag}
                </span>
                <h3 className="companion-name">
                  {currentCompanion.name}
                </h3>
                <p className="companion-desc">
                  {currentCompanion.desc}
                </p>

                <div className="companion-stats-box">
                  <div className="stat-row">
                    <span className="stat-label">Model Asset:</span>
                    <span className="stat-value">{currentCompanion.modelUrl}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Interaction:</span>
                    <span className="stat-value">Real-time Skeletal Loop + Orbit Drag</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Scale Normalization:</span>
                    <span className="stat-value">Standardized Bounding-Box Heights</span>
                  </div>
                </div>
              </div>

              <div className="companion-visual-pane">
                <Companion3DViewer
                  modelUrl={currentCompanion.modelUrl}
                  companionName={currentCompanion.name}
                  theme={theme}
                />
              </div>
            </div>

            {/* How to Download & Install */}
            <div className="section-divider" />
            <h2 className="section-title">How to Download &amp; Install</h2>
            <p className="skills-subtitle">Set up reminder.afk on your machine in three straightforward steps:</p>

            <div className="install-steps-grid">
              <div className="install-step-card">
                <div className="step-badge">STEP 01</div>
                <h3 className="step-title">Download .exe</h3>
                <p className="step-desc">
                  Click the direct download button to download the setup package directly onto your computer.
                </p>
                <button
                  type="button"
                  onClick={handleDirectDownload}
                  className="step-download-btn"
                >
                  <Icon icon="mdi:download" width="15" />
                  <span>Download .exe</span>
                </button>
              </div>

              <div className="install-step-card">
                <div className="step-badge">STEP 02</div>
                <h3 className="step-title">Run Setup Wizard</h3>
                <p className="step-desc">
                  Launch the downloaded installer. Select your preferred installation directory and create desktop shortcuts.
                </p>
                <div className="step-info-pill">
                  <Icon icon="mdi:shield-check-outline" width="14" />
                  <span>Verified Windows Setup</span>
                </div>
              </div>

              <div className="install-step-card">
                <div className="step-badge">STEP 03</div>
                <h3 className="step-title">Launch &amp; Work</h3>
                <p className="step-desc">
                  Open reminder.afk. The app docks into your Windows System Tray and begins managing your ergonomic break intervals automatically.
                </p>
                <div className="step-info-pill">
                  <Icon icon="mdi:clock-check-outline" width="14" />
                  <span>Auto-Scheduled Breaks</span>
                </div>
              </div>
            </div>

            {/* Release Notes & System Requirements */}
            <div className="section-divider" />
            <div className="specs-and-notes-container">
              <div className="specs-card">
                <div className="specs-card-header">
                  <Icon icon="mdi:tag-outline" className="specs-header-icon" />
                  <h3 className="specs-card-title">v1.0.0 Release Notes</h3>
                </div>
                <ul className="release-notes-list">
                  <li>
                    <strong>Asset Packaging:</strong> Integrated static asset bundling via Vite to resolve <code>.glb</code> binaries relative to the application runtime, ensuring zero runtime resolution errors in packaged builds.
                  </li>
                  <li>
                    <strong>Render Stability:</strong> Decoupled 2D UI elements from 3D transform matrices to guarantee crisp typography and eliminate GPU subpixel compositing artifacts.
                  </li>
                  <li>
                    <strong>Fault Tolerance:</strong> Implemented React Suspense boundaries and custom Error Boundaries around WebGL components to prevent UI lockouts.
                  </li>
                  <li>
                    <strong>Single Instance:</strong> Enforces single-instance desktop execution to prevent duplicate background processes.
                  </li>
                </ul>
              </div>

              <div className="specs-card">
                <div className="specs-card-header">
                  <Icon icon="mdi:laptop" className="specs-header-icon" />
                  <h3 className="specs-card-title">System Requirements</h3>
                </div>
                <div className="specs-table">
                  <div className="specs-table-row">
                    <span className="spec-name">Operating System</span>
                    <span className="spec-val">Windows 10 / 11 (64-bit)</span>
                  </div>
                  <div className="specs-table-row">
                    <span className="spec-name">Memory (RAM)</span>
                    <span className="spec-val">4 GB RAM (8 GB recommended)</span>
                  </div>
                  <div className="specs-table-row">
                    <span className="spec-name">Graphics</span>
                    <span className="spec-val">GPU with WebGL 2.0 Acceleration</span>
                  </div>
                  <div className="specs-table-row">
                    <span className="spec-name">Disk Space</span>
                    <span className="spec-val">~150 MB free space</span>
                  </div>
                  <div className="specs-table-row">
                    <span className="spec-name">License</span>
                    <span className="spec-val">MIT Open Source</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Download CTA Card */}
            <div className="section-divider" />
            <div className="reminder-bottom-cta-card">
              <h2 className="bottom-cta-title">Ready to Upgrade Your Workstation Health?</h2>
              <p className="bottom-cta-desc">
                Download reminder.afk for Windows today. Free, open-source, and engineered to keep your eyes and posture energized.
              </p>
              <div className="bottom-cta-actions">
                <button
                  type="button"
                  onClick={handleDirectDownload}
                  className="reminder-primary-btn"
                >
                  <Icon icon={downloading ? 'mdi:loading' : 'mdi:download'} className={downloading ? 'spin-icon' : 'btn-icon'} />
                  <span>{downloading ? 'Downloading...' : 'Download .exe (v1.0.0)'}</span>
                </button>
                <a
                  href={RELEASE_TAG_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="reminder-secondary-btn"
                >
                  <Icon icon="mdi:tag-outline" className="btn-icon" />
                  <span>View Release on GitHub</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ScrollToTopButton visible={showScrollTop} onClick={scrollToTop} />
    </>
  );
}
