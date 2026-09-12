import { useState, useEffect, type RefObject } from 'react';
import { Icon } from '@iconify/react';
import type { PageType, ThemeMode } from '../../types';
import SubpageHeader from '../common/SubpageHeader';
import SubpageQuickNav from '../common/SubpageQuickNav';
import ScrollToTopButton from '../common/ScrollToTopButton';
import { useScrollTop } from '../../hooks/useScrollTop';

interface LocalizationReleaseViewProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onNavigate: (page: PageType) => void;
  subpageRef: RefObject<HTMLDivElement | null>;
}

interface PlaygroundSample {
  id: string;
  filename: string;
  tabLabel: string;
  badge: string;
  codeLines: Array<{
    num: number;
    tokens: Array<{
      text: string;
      className?: string;
      isError?: boolean;
      tooltip?: string;
    }>;
  }>;
  problems: Array<{
    line: number;
    col: number;
    message: string;
    rule: string;
  }>;
}

const PLAYGROUND_SAMPLES: PlaygroundSample[] = [
  {
    id: 'jsx-text',
    filename: 'UserDashboard.tsx',
    tabLabel: 'JSX Elements',
    badge: 'Hardcoded Text',
    codeLines: [
      {
        num: 1,
        tokens: [
          { text: 'export function ', className: 'syn-kw' },
          { text: 'UserDashboard', className: 'syn-fn' },
          { text: '() {' }
        ]
      },
      {
        num: 2,
        tokens: [
          { text: '  return (' }
        ]
      },
      {
        num: 3,
        tokens: [
          { text: '    <', className: 'syn-tag' },
          { text: 'div ', className: 'syn-tag' },
          { text: 'className', className: 'syn-attr' },
          { text: '="dashboard-header">' }
        ]
      },
      {
        num: 4,
        tokens: [
          { text: '      <', className: 'syn-tag' },
          { text: 'h1', className: 'syn-tag' },
          { text: '>' },
          {
            text: 'Welcome back to your workspace',
            isError: true,
            tooltip: 'Hardcoded user-facing string detected. Wrap with i18n localization t() function.'
          },
          { text: '</', className: 'syn-tag' },
          { text: 'h1', className: 'syn-tag' },
          { text: '>' }
        ]
      },
      {
        num: 5,
        tokens: [
          { text: '      <', className: 'syn-tag' },
          { text: 'p', className: 'syn-tag' },
          { text: '>' },
          {
            text: 'Manage all active projects and deployments seamlessly.',
            isError: true,
            tooltip: 'Hardcoded user-facing string detected in JSX paragraph.'
          },
          { text: '</', className: 'syn-tag' },
          { text: 'p', className: 'syn-tag' },
          { text: '>' }
        ]
      },
      {
        num: 6,
        tokens: [
          { text: '    </', className: 'syn-tag' },
          { text: 'div', className: 'syn-tag' },
          { text: '>' }
        ]
      },
      {
        num: 7,
        tokens: [
          { text: '  );' }
        ]
      },
      {
        num: 8,
        tokens: [
          { text: '}' }
        ]
      }
    ],
    problems: [
      {
        line: 4,
        col: 11,
        message: 'Hardcoded string in JSX text: "Welcome back to your workspace"',
        rule: 'localizationCheck.hardcodedJsxText'
      },
      {
        line: 5,
        col: 10,
        message: 'Hardcoded string in JSX text: "Manage all active projects and deployments seamlessly."',
        rule: 'localizationCheck.hardcodedJsxText'
      }
    ]
  },
  {
    id: 'props-attributes',
    filename: 'ProjectForm.tsx',
    tabLabel: 'Props & Attributes',
    badge: 'Attribute Heuristics',
    codeLines: [
      {
        num: 1,
        tokens: [
          { text: 'export const ', className: 'syn-kw' },
          { text: 'InputField', className: 'syn-fn' },
          { text: ' = () => (' }
        ]
      },
      {
        num: 2,
        tokens: [
          { text: '  <', className: 'syn-tag' },
          { text: 'TextInput', className: 'syn-type' }
        ]
      },
      {
        num: 3,
        tokens: [
          { text: '    id', className: 'syn-attr' },
          { text: '="proj-name-input"', className: 'syn-str' },
          { text: ' ' },
          { text: '// Technical ID (Ignored)', className: 'syn-comment' }
        ]
      },
      {
        num: 4,
        tokens: [
          { text: '    label', className: 'syn-attr' },
          { text: '="' },
          {
            text: 'Project Repository Name',
            isError: true,
            tooltip: 'Hardcoded string in user-facing prop "label".'
          },
          { text: '"' }
        ]
      },
      {
        num: 5,
        tokens: [
          { text: '    placeholder', className: 'syn-attr' },
          { text: '="' },
          {
            text: 'e.g. organization/repo-name',
            isError: true,
            tooltip: 'Hardcoded string in user-facing prop "placeholder".'
          },
          { text: '"' }
        ]
      },
      {
        num: 6,
        tokens: [
          { text: '    aria-label', className: 'syn-attr' },
          { text: '="' },
          {
            text: 'Enter the target repository',
            isError: true,
            tooltip: 'Hardcoded string in accessibility attribute "aria-label".'
          },
          { text: '"' }
        ]
      },
      {
        num: 7,
        tokens: [
          { text: '  />' }
        ]
      },
      {
        num: 8,
        tokens: [
          { text: ');' }
        ]
      }
    ],
    problems: [
      {
        line: 4,
        col: 11,
        message: 'Hardcoded string in prop "label": "Project Repository Name"',
        rule: 'localizationCheck.userFacingProp'
      },
      {
        line: 5,
        col: 17,
        message: 'Hardcoded string in prop "placeholder": "e.g. organization/repo-name"',
        rule: 'localizationCheck.userFacingProp'
      },
      {
        line: 6,
        col: 16,
        message: 'Hardcoded string in prop "aria-label": "Enter the target repository"',
        rule: 'localizationCheck.userFacingProp'
      }
    ]
  },
  {
    id: 'toast-notifications',
    filename: 'authService.ts',
    tabLabel: 'Toast & Alerts',
    badge: 'Function Args',
    codeLines: [
      {
        num: 1,
        tokens: [
          { text: 'async function ', className: 'syn-kw' },
          { text: 'handleLogin', className: 'syn-fn' },
          { text: '(credentials: ', className: 'syn-type' },
          { text: 'AuthPayload', className: 'syn-type' },
          { text: ') {' }
        ]
      },
      {
        num: 2,
        tokens: [
          { text: '  try {' }
        ]
      },
      {
        num: 3,
        tokens: [
          { text: '    await ', className: 'syn-kw' },
          { text: 'api.login(credentials);' }
        ]
      },
      {
        num: 4,
        tokens: [
          { text: '    showNotification(' }
        ]
      },
      {
        num: 5,
        tokens: [
          { text: '      "success", ', className: 'syn-str' },
          { text: '// Status arg skipped', className: 'syn-comment' }
        ]
      },
      {
        num: 6,
        tokens: [
          { text: '      "' },
          {
            text: 'Successfully Authenticated',
            isError: true,
            tooltip: 'Hardcoded notification title string detected.'
          },
          { text: '",' }
        ]
      },
      {
        num: 7,
        tokens: [
          { text: '      "' },
          {
            text: 'Redirecting to your dashboard session...',
            isError: true,
            tooltip: 'Hardcoded notification description message detected.'
          },
          { text: '"' }
        ]
      },
      {
        num: 8,
        tokens: [
          { text: '    );' }
        ]
      },
      {
        num: 9,
        tokens: [
          { text: '  } catch (err) { /* ... */ }' }
        ]
      },
      {
        num: 10,
        tokens: [
          { text: '}' }
        ]
      }
    ],
    problems: [
      {
        line: 6,
        col: 7,
        message: 'Hardcoded string in toast argument [1]: "Successfully Authenticated"',
        rule: 'localizationCheck.notificationArg'
      },
      {
        line: 7,
        col: 7,
        message: 'Hardcoded string in toast argument [2]: "Redirecting to your dashboard session..."',
        rule: 'localizationCheck.notificationArg'
      }
    ]
  },
  {
    id: 'object-literals',
    filename: 'modalConfig.ts',
    tabLabel: 'Object Configs',
    badge: 'Key Heuristics',
    codeLines: [
      {
        num: 1,
        tokens: [
          { text: 'export const ', className: 'syn-kw' },
          { text: 'deleteModalProps', className: 'syn-var' },
          { text: ' = {' }
        ]
      },
      {
        num: 2,
        tokens: [
          { text: '  title: "', className: 'syn-prop' },
          {
            text: 'Confirm Record Deletion',
            isError: true,
            tooltip: 'Hardcoded user-facing string in object key "title".'
          },
          { text: '",' }
        ]
      },
      {
        num: 3,
        tokens: [
          { text: '  message: "', className: 'syn-prop' },
          {
            text: 'This action cannot be undone and will erase all data.',
            isError: true,
            tooltip: 'Hardcoded user-facing string in object key "message".'
          },
          { text: '",' }
        ]
      },
      {
        num: 4,
        tokens: [
          { text: '  confirmText: "', className: 'syn-prop' },
          {
            text: 'Yes, permanently delete',
            isError: true,
            tooltip: 'Hardcoded user-facing string in object key "confirmText".'
          },
          { text: '",' }
        ]
      },
      {
        num: 5,
        tokens: [
          { text: '  variant: "danger"', className: 'syn-str' },
          { text: ' ' },
          { text: '// Internal enum/key (Ignored)', className: 'syn-comment' }
        ]
      },
      {
        num: 6,
        tokens: [
          { text: '};' }
        ]
      }
    ],
    problems: [
      {
        line: 2,
        col: 11,
        message: 'Hardcoded string in object property "title": "Confirm Record Deletion"',
        rule: 'localizationCheck.objectProperty'
      },
      {
        line: 3,
        col: 13,
        message: 'Hardcoded string in object property "message": "This action cannot be undone and will erase all data."',
        rule: 'localizationCheck.objectProperty'
      },
      {
        line: 4,
        col: 17,
        message: 'Hardcoded string in object property "confirmText": "Yes, permanently delete"',
        rule: 'localizationCheck.objectProperty'
      }
    ]
  }
];

const REPO_URL = 'https://github.com/PramudithaN/localization-check';
const FALLBACK_VERSION = 'v0.1.5';
const CLONE_CMD = 'git clone https://github.com/PramudithaN/localization-check.git';
const VSCODE_INSTALL_CMD = 'code --install-extension localizationFinder.localization-check';

export default function LocalizationReleaseView({
  theme,
  onToggleTheme,
  onNavigate,
  subpageRef
}: LocalizationReleaseViewProps) {
  const { showScrollTop, scrollToTop } = useScrollTop('localization', subpageRef);
  const [activeSampleId, setActiveSampleId] = useState<string>('jsx-text');
  const [copiedClone, setCopiedClone] = useState(false);
  const [copiedInstallCmd, setCopiedInstallCmd] = useState(false);
  const [copiedConfig, setCopiedConfig] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  // Dynamic GitHub Release details
  const [versionTag, setVersionTag] = useState<string>(FALLBACK_VERSION);
  const [releaseUrl, setReleaseUrl] = useState<string>(`${REPO_URL}/releases`);
  const [starCount, setStarCount] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchRepoData() {
      try {
        const [relRes, repoRes] = await Promise.all([
          fetch('https://api.github.com/repos/PramudithaN/localization-check/releases/latest'),
          fetch('https://api.github.com/repos/PramudithaN/localization-check')
        ]);

        if (relRes.ok) {
          const relData = await relRes.json();
          if (isMounted && relData.tag_name) {
            setVersionTag(relData.tag_name);
            if (relData.html_url) setReleaseUrl(relData.html_url);
          }
        }

        if (repoRes.ok) {
          const repoData = await repoRes.json();
          if (isMounted && typeof repoData.stargazers_count === 'number') {
            setStarCount(repoData.stargazers_count);
          }
        }
      } catch {
        // Retain fallbacks on network limits
      }
    }

    fetchRepoData();

    return () => {
      isMounted = false;
    };
  }, []);

  const activeSample =
    PLAYGROUND_SAMPLES.find((s) => s.id === activeSampleId) || PLAYGROUND_SAMPLES[0];

  const handleCopyClone = async () => {
    try {
      await navigator.clipboard.writeText(CLONE_CMD);
      setCopiedClone(true);
      setTimeout(() => setCopiedClone(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleCopyInstall = async () => {
    try {
      await navigator.clipboard.writeText(VSCODE_INSTALL_CMD);
      setCopiedInstallCmd(true);
      setTimeout(() => setCopiedInstallCmd(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleCopyCommand = async (cmd: string) => {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopiedCommand(cmd);
      setTimeout(() => setCopiedCommand(null), 2000);
    } catch {
      // fallback
    }
  };

  const settingsConfigJson = `{
  "localizationCheck.scriptPath": "scripts/check-localization.js",
  "localizationCheck.scanOnSave": true,
  "localizationCheck.severity": "error",
  "localizationCheck.ignoredPatterns": [
    "**/test/**",
    "**/*.spec.ts",
    "**/*.stories.tsx"
  ]
}`;

  const handleCopyConfig = async () => {
    try {
      await navigator.clipboard.writeText(settingsConfigJson);
      setCopiedConfig(true);
      setTimeout(() => setCopiedConfig(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <>
      <div
        ref={subpageRef as RefObject<HTMLDivElement>}
        className={`subpage-container localization-subpage ${theme}-theme`}
      >
        <div className="subpage-scroll-content">
          {/* Subpage Background Watermark */}
          <div className="subpage-bg-watermark right-watermark">
            <span>PRAMUDITH NADUN | LOCALIZATION CHECK</span>
          </div>

          {/* Top Header */}
          <SubpageHeader
            theme={theme}
            onToggleTheme={onToggleTheme}
            onNavigateHome={() => onNavigate('home')}
            onBack={() => onNavigate('home')}
            currentPage="localization"
            onNavigate={onNavigate}
            hideNav={true}
            hideBack={true}
            centerText="VS Code Extension | Localization Check"
          />

          {/* Subpage Title */}
          <h1 className="subpage-title">localization-check</h1>
          <p className="subpage-subtitle">
            VS Code Extension · I18n &amp; Hardcoded String Diagnostic Engine · {versionTag}
          </p>

          <div className="localization-content-wrapper">
            {/* Main Hero Card */}
            <div className="localization-hero-card">
              <div className="localization-hero-brand-row">
                <img
                  src="/images/localization-check-icon.png"
                  alt="Localization Check Logo"
                  className="lc-brand-logo"
                  width="72"
                  height="72"
                />
                <div className="localization-hero-topbar">
                  <div className="lc-badge-pill">
                    <span className="lc-pulse-dot" />
                    <span>{versionTag} Release</span>
                  </div>
                  <span className="lc-tag">
                    <Icon icon="logos:visual-studio-code" width="14" height="14" />
                    <span>VS Code ^1.80+</span>
                  </span>
                  <span className="lc-tag">
                    <Icon icon="mdi:license" width="14" height="14" />
                    <span>MIT License</span>
                  </span>
                  <span className="lc-tag">
                    <Icon icon="mdi:tag-outline" width="14" height="14" />
                    <span>Linters &amp; I18n</span>
                  </span>
                  {starCount !== null && (
                    <span className="lc-tag">
                      <Icon icon="mdi:star" width="14" height="14" color="#f59e0b" />
                      <span>{starCount} stars</span>
                    </span>
                  )}
                </div>
              </div>

              <h2 className="localization-card-headline">
                Flag Hardcoded UI Strings Before They Reach Production
              </h2>

              <p className="localization-card-desc">
                An intelligent, low-overhead <strong>VS Code extension</strong> built to eliminate
                untranslated copy and ensure robust internationalization. It continuously analyzes
                changed JavaScript and TypeScript buffers using AST traversal heuristics—instantly
                highlighting raw strings in <strong>JSX tags</strong>, <strong>component props</strong> (<code>label</code>, <code>placeholder</code>, <code>aria-label</code>),
                <strong>notification calls</strong>, and <strong>object structures</strong>.
              </p>

              {/* Action Buttons */}
              <div className="localization-hero-actions">
                <a
                  href={REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lc-primary-btn"
                  title="View on GitHub"
                >
                  <Icon icon="mdi:github" width="18" height="18" />
                  <span>GitHub Repository</span>
                  <span>↗</span>
                </a>

                <a
                  href={releaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lc-secondary-btn"
                  title="Download VSIX / GitHub Releases"
                >
                  <Icon icon="mdi:package-variant-closed" width="17" height="17" />
                  <span>Releases &amp; VSIX</span>
                </a>

                <button
                  type="button"
                  className="lc-clone-pill-btn"
                  onClick={handleCopyInstall}
                  title="Copy VS Code install command"
                >
                  <Icon icon={copiedInstallCmd ? 'mdi:check' : 'mdi:content-copy'} width="14" height="14" />
                  <span>{copiedInstallCmd ? 'Copied command!' : 'code --install-extension'}</span>
                </button>

                <button
                  type="button"
                  className="lc-clone-pill-btn"
                  onClick={handleCopyClone}
                  title="Copy git clone command"
                >
                  <Icon icon={copiedClone ? 'mdi:check' : 'mdi:git'} width="14" height="14" />
                  <span>{copiedClone ? 'Copied git clone!' : 'git clone localization-check'}</span>
                </button>
              </div>

              {/* Tech Stack Tags */}
              <div className="lc-tech-stack-row">
                <span className="lc-tech-tag">
                  <Icon icon="logos:visual-studio-code" width="14" /> VS Code Extension API
                </span>
                <span className="lc-tech-tag">
                  <Icon icon="logos:typescript-icon" width="14" /> TypeScript &amp; JavaScript
                </span>
                <span className="lc-tech-tag">
                  <Icon icon="logos:nodejs-icon" width="14" /> Node.js AST Engine
                </span>
                <span className="lc-tech-tag">
                  <Icon icon="logos:git-icon" width="14" /> Git Staged Diff Filtering
                </span>
                <span className="lc-tech-tag">
                  <Icon icon="mdi:shield-check-outline" width="14" /> Real-time Diagnostics
                </span>
              </div>
            </div>

            {/* Interactive Live Playground / AST Inspector */}
            <div className="section-divider" />
            <div className="showcase-section-header">
              <div className="showcase-badge-pill">
                <Icon icon="mdi:code-braces" width="14" height="14" />
                <span>Interactive Diagnostic Preview</span>
              </div>
              <h2 className="section-title">See It in Action</h2>
              <p className="skills-subtitle">
                Explore how <strong>Localization Check</strong> flags untranslated copy across common code patterns:
              </p>
            </div>

            <div className="lc-playground-card">
              {/* Window Titlebar & File Tabs */}
              <div className="lc-playground-header">
                <div className="lc-window-dots">
                  <span className="lc-window-dot dot-red" />
                  <span className="lc-window-dot dot-yellow" />
                  <span className="lc-window-dot dot-green" />
                </div>

                <div className="lc-editor-tabs">
                  {PLAYGROUND_SAMPLES.map((sample) => (
                    <button
                      key={sample.id}
                      type="button"
                      className={`lc-editor-tab ${sample.id === activeSampleId ? 'active' : ''}`}
                      onClick={() => setActiveSampleId(sample.id)}
                    >
                      <Icon icon="logos:typescript-icon" width="13" />
                      <span>{sample.filename}</span>
                      <span className="lc-tab-badge">{sample.tabLabel}</span>
                    </button>
                  ))}
                </div>

                <span style={{ fontSize: '0.72rem', color: '#6b7280', fontFamily: 'monospace' }}>
                  {activeSample.badge}
                </span>
              </div>

              {/* Code Viewer */}
              <div className="lc-editor-body">
                {activeSample.codeLines.map((line) => (
                  <div key={line.num} className="lc-code-line">
                    <span className="lc-line-num">{line.num}</span>
                    <div className="lc-code-content">
                      {line.tokens.map((tok, i) =>
                        tok.isError ? (
                          <span
                            key={i}
                            className="lc-flagged-error"
                            data-tooltip={tok.tooltip}
                          >
                            {tok.text}
                          </span>
                        ) : (
                          <span key={i} className={tok.className || ''}>
                            {tok.text}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Mock VS Code Problems Panel */}
              <div className="lc-problems-panel">
                <div className="lc-problems-bar">
                  <span className="lc-problems-title">
                    <Icon icon="mdi:alert-circle-outline" width="14" height="14" color="#ef4444" />
                    <span>PROBLEMS ({activeSample.problems.length})</span>
                  </span>
                  <span>{activeSample.filename}</span>
                </div>

                {activeSample.problems.map((p, idx) => (
                  <div key={idx} className="lc-problem-item">
                    <Icon icon="mdi:close-circle" width="13" height="13" color="#ef4444" />
                    <span>{p.message}</span>
                    <span className="lc-problem-loc">
                      [{p.rule}] Ln {p.line}, Col {p.col}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Highlights Grid */}
            <div className="section-divider" />
            <div className="showcase-section-header">
              <div className="showcase-badge-pill">
                <Icon icon="mdi:creation-outline" width="14" height="14" />
                <span>Detection Capabilities</span>
              </div>
              <h2 className="section-title">Intelligent AST Heuristics</h2>
              <p className="skills-subtitle">
                Engineered to catch real user-facing copy without noisy false positives on IDs, keys, or enum types:
              </p>
            </div>

            <div className="lc-features-grid">
              <div className="lc-feature-card">
                <div className="lc-feature-icon-wrap">
                  <Icon icon="mdi:xml" width="24" height="24" />
                </div>
                <h3 className="lc-feature-title">JSX Text &amp; Fragments</h3>
                <p className="lc-feature-desc">
                  Flags hardcoded strings within JSX tags, multiline expressions, nested layout elements (such as <code>&lt;kbd&gt;</code>), and text interspersed with spacing blocks like <code>{`{ " " }`}</code>.
                </p>
                <div className="lc-feature-chips">
                  <span className="lc-feature-chip">.jsx / .tsx</span>
                  <span className="lc-feature-chip">Multiline JSX</span>
                  <span className="lc-feature-chip">Layout Spacers</span>
                </div>
              </div>

              <div className="lc-feature-card">
                <div className="lc-feature-icon-wrap">
                  <Icon icon="mdi:form-textbox" width="24" height="24" />
                </div>
                <h3 className="lc-feature-title">User-Facing Prop Filtering</h3>
                <p className="lc-feature-desc">
                  Recognizes standard user-facing attributes such as <code>label</code>, <code>title</code>, <code>placeholder</code>, <code>tooltip</code>, <code>aria-label</code>, <code>alt</code>, <code>description</code>, <code>helperText</code>, and <code>buttonText</code>.
                </p>
                <div className="lc-feature-chips">
                  <span className="lc-feature-chip">Accessibility Props</span>
                  <span className="lc-feature-chip">Form Attributes</span>
                  <span className="lc-feature-chip">UI Titles</span>
                </div>
              </div>

              <div className="lc-feature-card">
                <div className="lc-feature-icon-wrap">
                  <Icon icon="mdi:message-alert-outline" width="24" height="24" />
                </div>
                <h3 className="lc-feature-title">Smart Notification Scanning</h3>
                <p className="lc-feature-desc">
                  Scans notification and toast invocations (e.g. <code>showNotification(...)</code>), automatically skipping the 1st status parameter while analyzing subsequent message parameters.
                </p>
                <div className="lc-feature-chips">
                  <span className="lc-feature-chip">Toast Alerts</span>
                  <span className="lc-feature-chip">Notification APIs</span>
                  <span className="lc-feature-chip">Status Arg Skipping</span>
                </div>
              </div>

              <div className="lc-feature-card">
                <div className="lc-feature-icon-wrap">
                  <Icon icon="mdi:source-commit" width="24" height="24" />
                </div>
                <h3 className="lc-feature-title">Git-Staged Precision</h3>
                <p className="lc-feature-desc">
                  Defaults to scanning only files changed in Git or unsaved editor buffers. Keeps performance ultra-fast with zero editor latency across massive enterprise codebases.
                </p>
                <div className="lc-feature-chips">
                  <span className="lc-feature-chip">Git Staged Only</span>
                  <span className="lc-feature-chip">Zero Input Lag</span>
                  <span className="lc-feature-chip">Instant Diagnostics</span>
                </div>
              </div>
            </div>

            {/* Commands & Configuration Reference */}
            <div className="section-divider" />
            <div className="lc-reference-grid">
              {/* Commands Card */}
              <div className="lc-info-card">
                <div className="lc-info-header">
                  <h3 className="lc-info-title">
                    <Icon icon="mdi:keyboard-outline" width="20" height="20" color="#f59e0b" />
                    <span>Extension Commands</span>
                  </h3>
                </div>

                <div className="lc-command-item">
                  <div className="lc-cmd-name">
                    <span>localizationCheck.run</span>
                    <button
                      type="button"
                      className="logic-cv-pill-btn"
                      style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
                      onClick={() => handleCopyCommand('Localization: Run Full Check (git staged)')}
                      title="Copy command name"
                    >
                      <Icon
                        icon={copiedCommand === 'Localization: Run Full Check (git staged)' ? 'mdi:check' : 'mdi:content-copy'}
                        width="12"
                        height="12"
                      />
                      <span>{copiedCommand === 'Localization: Run Full Check (git staged)' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="lc-cmd-desc">
                    <strong>Localization: Run Full Check (git staged)</strong><br />
                    Executes the localization check script against all git-staged changes and displays structured output in the VS Code Output panel.
                  </p>
                </div>

                <div className="lc-command-item">
                  <div className="lc-cmd-name">
                    <span>localizationCheck.scanFile</span>
                    <button
                      type="button"
                      className="logic-cv-pill-btn"
                      style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
                      onClick={() => handleCopyCommand('Localization: Re-scan Current File')}
                      title="Copy command name"
                    >
                      <Icon
                        icon={copiedCommand === 'Localization: Re-scan Current File' ? 'mdi:check' : 'mdi:content-copy'}
                        width="12"
                        height="12"
                      />
                      <span>{copiedCommand === 'Localization: Re-scan Current File' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="lc-cmd-desc">
                    <strong>Localization: Re-scan Current File</strong><br />
                    Manually triggers an immediate re-scan and diagnostics refresh for the currently active editor buffer.
                  </p>
                </div>
              </div>

              {/* Settings Card */}
              <div className="lc-info-card">
                <div className="lc-info-header">
                  <h3 className="lc-info-title">
                    <Icon icon="mdi:tune" width="20" height="20" color="#f59e0b" />
                    <span>Workspace Settings</span>
                  </h3>
                  <button
                    type="button"
                    className="logic-cv-pill-btn"
                    style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                    onClick={handleCopyConfig}
                    title="Copy settings.json block"
                  >
                    <Icon icon={copiedConfig ? 'mdi:check' : 'mdi:content-copy'} width="13" height="13" />
                    <span>{copiedConfig ? 'Copied JSON' : 'Copy Config'}</span>
                  </button>
                </div>
                <p className="lc-cmd-desc" style={{ marginBottom: '0.75rem' }}>
                  Add these configurations to your project's <code>.vscode/settings.json</code>:
                </p>
                <pre className="lc-config-pre">
                  <code>{settingsConfigJson}</code>
                </pre>
              </div>
            </div>

            {/* Installation Hub */}
            <div className="section-divider" />
            <div className="lc-install-hub">
              <div className="showcase-badge-pill">
                <Icon icon="mdi:download" width="14" height="14" />
                <span>Get Started</span>
              </div>
              <h2 className="section-title" style={{ marginTop: '0.5rem' }}>Installation Options</h2>
              <p className="skills-subtitle">
                Choose the best way to integrate <strong>Localization Check</strong> into your development workflow:
              </p>

              <div className="lc-install-grid">
                <div className="lc-install-option">
                  <span className="lc-opt-num">01 / CLI INSTALL</span>
                  <h4 className="lc-opt-title">VS Code Command Line</h4>
                  <p className="lc-opt-desc">
                    Install the extension directly via terminal in one step using the official VS Code CLI.
                  </p>
                  <div
                    className="lc-copy-snippet"
                    onClick={handleCopyInstall}
                    title="Click to copy CLI install command"
                  >
                    <span>{copiedInstallCmd ? 'Copied to clipboard!' : VSCODE_INSTALL_CMD}</span>
                    <Icon icon={copiedInstallCmd ? 'mdi:check' : 'mdi:content-copy'} width="14" height="14" />
                  </div>
                </div>

                <div className="lc-install-option">
                  <span className="lc-opt-num">02 / VSIX PACKAGE</span>
                  <h4 className="lc-opt-title">Manual VSIX Release</h4>
                  <p className="lc-opt-desc">
                    Download packaged <code>.vsix</code> releases directly from GitHub Releases and install via VS Code's "Install from VSIX..." menu.
                  </p>
                  <a
                    href={releaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lc-copy-snippet"
                    style={{ textDecoration: 'none' }}
                  >
                    <span>Download Latest .vsix ({versionTag})</span>
                    <Icon icon="mdi:open-in-new" width="14" height="14" />
                  </a>
                </div>

                <div className="lc-install-option">
                  <span className="lc-opt-num">03 / SOURCE &amp; DEBUG</span>
                  <h4 className="lc-opt-title">Develop from Source</h4>
                  <p className="lc-opt-desc">
                    Clone the open-source repository, run <code>npm install</code>, and press <code>F5</code> to launch Extension Development Host.
                  </p>
                  <div
                    className="lc-copy-snippet"
                    onClick={handleCopyClone}
                    title="Click to copy clone command"
                  >
                    <span>{copiedClone ? 'Copied to clipboard!' : CLONE_CMD}</span>
                    <Icon icon={copiedClone ? 'mdi:check' : 'mdi:content-copy'} width="14" height="14" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Navigation to Other Sections */}
            <SubpageQuickNav currentPage="localization" onNavigate={onNavigate} theme={theme} />
          </div>
        </div>
      </div>

      <ScrollToTopButton visible={showScrollTop} onClick={scrollToTop} />
    </>
  );
}
