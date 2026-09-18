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
      isSuccess?: boolean;
      tooltip?: string;
    }>;
  }>;
  problems: Array<{
    line: number;
    col: number;
    message: string;
    rule: string;
    isSuccess?: boolean;
  }>;
}

interface ExtensionCommand {
  id: string;
  name: string;
  desc: string;
  shortcutWin: string;
  shortcutMac: string;
  isAi?: boolean;
}

const PLAYGROUND_SAMPLES: PlaygroundSample[] = [
  {
    id: 'copilot-autofix',
    filename: 'WelcomeBanner.tsx',
    tabLabel: 'Copilot AI Quick Fix',
    badge: 'AI Auto-Localize & Hook Injection',
    codeLines: [
      {
        num: 1,
        tokens: [
          { text: 'import { useTranslation } from ', className: 'syn-kw' },
          { text: "'react-i18next'", className: 'syn-str' },
          { text: '; ' },
          { text: '// ✨ Auto-injected hook import', className: 'syn-comment' }
        ]
      },
      {
        num: 2,
        tokens: [
          { text: 'export function ', className: 'syn-kw' },
          { text: 'WelcomeBanner', className: 'syn-fn' },
          { text: '() {' }
        ]
      },
      {
        num: 3,
        tokens: [
          { text: '  const { t } = ', className: 'syn-kw' },
          { text: 'useTranslation();', className: 'syn-fn' },
          { text: ' ' },
          { text: '// ✨ Auto-detected missing declaration', className: 'syn-comment' }
        ]
      },
      {
        num: 4,
        tokens: [
          { text: '  return (' }
        ]
      },
      {
        num: 5,
        tokens: [
          { text: '    <', className: 'syn-tag' },
          { text: 'div ', className: 'syn-tag' },
          { text: 'className', className: 'syn-attr' },
          { text: '="hero-banner">' }
        ]
      },
      {
        num: 6,
        tokens: [
          { text: '      <', className: 'syn-tag' },
          { text: 'h1', className: 'syn-tag' },
          { text: '>{' },
          {
            text: "t('dashboard.welcomeTitle')",
            isSuccess: true,
            tooltip: 'Auto-extracted string replaced with t() and written to en.json'
          },
          { text: '}</', className: 'syn-tag' },
          { text: 'h1', className: 'syn-tag' },
          { text: '>' }
        ]
      },
      {
        num: 7,
        tokens: [
          { text: '      <', className: 'syn-tag' },
          { text: 'button ', className: 'syn-tag' },
          { text: 'type', className: 'syn-attr' },
          { text: '="button">' },
          { text: '{' },
          {
            text: "t('common.save')",
            isSuccess: true,
            tooltip: 'Common action recognized and deduplicated into common.save'
          },
          { text: '}</', className: 'syn-tag' },
          { text: 'button', className: 'syn-tag' },
          { text: '>' }
        ]
      },
      {
        num: 8,
        tokens: [
          { text: '    </', className: 'syn-tag' },
          { text: 'div', className: 'syn-tag' },
          { text: '>' }
        ]
      },
      {
        num: 9,
        tokens: [
          { text: '  );' }
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
        col: 11,
        message: '✓ [Copilot AI] Extracted "Welcome to Workspace" to locales/en.json -> dashboard.welcomeTitle',
        rule: 'localizationCheck.copilot',
        isSuccess: true
      },
      {
        line: 7,
        col: 15,
        message: '✓ [Dictionary Sync] Deduplicated "Save" into global namespace "common.save"',
        rule: 'localizationCheck.dictionarySync',
        isSuccess: true
      }
    ]
  },
  {
    id: 'jsx-text',
    filename: 'UserDashboard.tsx',
    tabLabel: 'JSX Elements',
    badge: 'Hardcoded Text Detection',
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
            tooltip: 'Hardcoded user-facing string detected. Press Alt+L to localize with Copilot.'
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

const EXTENSION_COMMANDS: ExtensionCommand[] = [
  {
    id: 'localizationCheck.localizeWithCopilot',
    name: 'Add Localization with Copilot',
    desc: 'Extracts selected text, replaces it with clean translation code, and saves it straight to your language dictionary.',
    shortcutWin: 'Alt + L',
    shortcutMac: '⌥ Option + L',
    isAi: true
  },
  {
    id: 'localizationCheck.localizeAllInFile',
    name: 'Localize All in Current File with Copilot',
    desc: 'Scans the entire open file and automatically converts all untranslated text with AI in a single pass.',
    shortcutWin: 'Alt + Shift + L',
    shortcutMac: '⌥ Option + ⇧ Shift + L',
    isAi: true
  },
  {
    id: 'localizationCheck.flagHardcoded',
    name: 'Flag Pattern as Hardcoded Rule (Report & Learn)',
    desc: 'Teach the extension a new text pattern to watch for across your project and share feedback.',
    shortcutWin: 'Alt + F',
    shortcutMac: '⌥ Option + F'
  },
  {
    id: 'localizationCheck.markFalsePositive',
    name: 'Mark / Ignore as False Positive (Report & Learn)',
    desc: 'Tells the extension to ignore internal IDs, code keys, or non-translatable technical text.',
    shortcutWin: 'Alt + M',
    shortcutMac: '⌥ Option + M'
  },
  {
    id: 'localizationCheck.scanFile',
    name: 'Re-scan Current File',
    desc: 'Instantly checks your current file for any missed hardcoded text and refreshes warnings.',
    shortcutWin: 'Alt + S',
    shortcutMac: '⌥ Option + S'
  },
  {
    id: 'localizationCheck.run',
    name: 'Run Full Check (git staged)',
    desc: 'Checks all your newly modified and staged files at once before committing changes.',
    shortcutWin: 'Alt + R',
    shortcutMac: '⌥ Option + R'
  }
];

const REPO_URL = 'https://github.com/PramudithaN/localization-check';
const FALLBACK_VERSION = 'v0.4.8';
const CLONE_CMD = 'git clone https://github.com/PramudithaN/localization-check.git';
const VSCODE_INSTALL_CMD = 'code --install-extension localizationFinder.localization-check';

export default function LocalizationReleaseView({
  theme,
  onToggleTheme,
  onNavigate,
  subpageRef
}: LocalizationReleaseViewProps) {
  const { showScrollTop, scrollToTop } = useScrollTop('localization', subpageRef);
  const [activeSampleId, setActiveSampleId] = useState<string>('copilot-autofix');
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
            VS Code Extension · AI Translation Assistant · Multi-Language Ready · {versionTag}
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
                    <span>VS Code ^1.84+</span>
                  </span>
                  <span className="lc-tag">
                    <Icon icon="logos:github-copilot" width="14" height="14" />
                    <span>Copilot AI Powered</span>
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
                Catch &amp; Translate Hardcoded Text Before It Reaches Users
              </h2>

              <p className="localization-card-desc">
                An intuitive <strong>VS Code extension</strong> that keeps your apps ready for global audiences.
                It continuously watches your code as you type, highlighting plain English or untranslated words in buttons,
                titles, forms, and popups. With built-in <strong>GitHub Copilot AI</strong>, you can turn raw text into
                clean, multi-language translations and update your language dictionary with a single shortcut.
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
                  <Icon icon="logos:github-copilot" width="14" /> GitHub Copilot Quick Fix
                </span>
                <span className="lc-tech-tag">
                  <Icon icon="logos:typescript-icon" width="14" /> TypeScript &amp; JavaScript
                </span>
                <span className="lc-tech-tag">
                  <Icon icon="logos:react" width="14" /> react-i18next Hook Injector
                </span>
                <span className="lc-tech-tag">
                  <Icon icon="mdi:code-json" width="14" /> en.json Dictionary Sync
                </span>
                <span className="lc-tech-tag">
                  <Icon icon="logos:git-icon" width="14" /> Git Staged Diff Filtering
                </span>
              </div>
            </div>

            {/* Interactive Live Playground / AST Inspector */}
            <div className="section-divider" />
            <div className="showcase-section-header">
              <div className="showcase-badge-pill">
                <Icon icon="mdi:code-braces" width="14" height="14" />
                <span>Interactive Live Demo</span>
              </div>
              <h2 className="section-title">See How It Works</h2>
              <p className="skills-subtitle">
                Watch how the extension highlights untranslated text and automatically turns it into clean multi-language code:
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
                      <Icon icon={sample.id === 'copilot-autofix' ? 'logos:github-copilot' : 'logos:typescript-icon'} width={13} />
                      <span>{sample.filename}</span>
                      <span className={`lc-tab-badge ${sample.id === 'copilot-autofix' ? 'copilot-badge' : ''}`}>
                        {sample.tabLabel}
                      </span>
                    </button>
                  ))}
                </div>

                <span className="lc-sample-badge-text">
                  {activeSample.badge}
                </span>
              </div>

              {/* Code Viewer */}
              <div className="lc-editor-body">
                {activeSample.codeLines.map((line) => (
                  <div key={line.num} className="lc-code-line">
                    <span className="lc-line-num">{line.num}</span>
                    <div className="lc-code-content">
                      {line.tokens.map((tok, i) => {
                        if (tok.isError) {
                          return (
                            <span
                              key={i}
                              className="lc-flagged-error"
                              data-tooltip={tok.tooltip}
                            >
                              {tok.text}
                            </span>
                          );
                        }
                        if (tok.isSuccess) {
                          return (
                            <span
                              key={i}
                              className="lc-flagged-success"
                              data-tooltip={tok.tooltip}
                            >
                              {tok.text}
                            </span>
                          );
                        }
                        return (
                          <span key={i} className={tok.className || ''}>
                            {tok.text}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Mock VS Code Problems Panel */}
              <div className="lc-problems-panel">
                <div className="lc-problems-bar">
                  <span className="lc-problems-title">
                    <Icon
                      icon={activeSample.id === 'copilot-autofix' ? 'mdi:check-circle-outline' : 'mdi:alert-circle-outline'}
                      width="14"
                      height="14"
                      color={activeSample.id === 'copilot-autofix' ? '#f59e0b' : '#ef4444'}
                    />
                    <span>
                      {activeSample.id === 'copilot-autofix'
                        ? `AI AUTO-LOCALIZATION APPLIED (${activeSample.problems.length})`
                        : `PROBLEMS (${activeSample.problems.length})`}
                    </span>
                  </span>
                  <span>{activeSample.filename}</span>
                </div>

                {activeSample.problems.map((p, idx) => (
                  <div
                    key={idx}
                    className={`lc-problem-item ${p.isSuccess ? 'item-success' : ''}`}
                  >
                    <Icon
                      icon={p.isSuccess ? 'mdi:check-circle' : 'mdi:close-circle'}
                      width="13"
                      height="13"
                      color={p.isSuccess ? '#f59e0b' : '#ef4444'}
                    />
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
                <span>Key Features &amp; Benefits</span>
              </div>
              <h2 className="section-title">Built for Speed, Designed for Global Teams</h2>
              <p className="skills-subtitle">
                Everything you need to build multilingual applications without the manual hassle:
              </p>
            </div>

            <div className="lc-features-grid">
              {/* Feature 1: Copilot AI */}
              <div className="lc-feature-card">
                <div className="lc-feature-icon-wrap">
                  <Icon icon="logos:github-copilot" width="24" height="24" />
                </div>
                <h3 className="lc-feature-title">AI-Powered One-Click Fixes</h3>
                <p className="lc-feature-desc">
                  Convert plain text into localized phrases instantly with GitHub Copilot. Simply press a keyboard shortcut to generate the right translation keys and update your code.
                </p>
                <div className="lc-feature-chips">
                  <span className="lc-feature-chip">One-Click AI Fix</span>
                  <span className="lc-feature-chip">Batch Translate</span>
                  <span className="lc-feature-chip">Alt + L</span>
                </div>
              </div>

              {/* Feature 2: Translation Hook Injector */}
              <div className="lc-feature-card">
                <div className="lc-feature-icon-wrap">
                  <Icon icon="mdi:hook" width="24" height="24" />
                </div>
                <h3 className="lc-feature-title">Automatic Translation Setup</h3>
                <p className="lc-feature-desc">
                  No manual boilerplate. When you translate text, the extension automatically hooks up your React translation tools and imports without messing up your existing code.
                </p>
                <div className="lc-feature-chips">
                  <span className="lc-feature-chip">Zero Boilerplate</span>
                  <span className="lc-feature-chip">React &amp; Next.js</span>
                  <span className="lc-feature-chip">Clean Imports</span>
                </div>
              </div>

              {/* Feature 3: Dictionary Sync & Deduplication */}
              <div className="lc-feature-card">
                <div className="lc-feature-icon-wrap">
                  <Icon icon="mdi:sync" width="24" height="24" />
                </div>
                <h3 className="lc-feature-title">Auto-Organized Language Dictionary</h3>
                <p className="lc-feature-desc">
                  Keeps your translation files neat and tidy. New words are saved straight to your language dictionary, while common actions like "Save" or "Cancel" are automatically reused.
                </p>
                <div className="lc-feature-chips">
                  <span className="lc-feature-chip">Auto-Saved Dictionary</span>
                  <span className="lc-feature-chip">Smart Deduplication</span>
                  <span className="lc-feature-chip">en.json</span>
                </div>
              </div>

              {/* Feature 4: JSX & Prop Heuristics */}
              <div className="lc-feature-card">
                <div className="lc-feature-icon-wrap">
                  <Icon icon="mdi:xml" width="24" height="24" />
                </div>
                <h3 className="lc-feature-title">Smart UI &amp; Text Detection</h3>
                <p className="lc-feature-desc">
                  Finds visible text everywhere your users see it—including buttons, placeholders, page titles, alerts, and accessibility labels—while safely ignoring internal code IDs.
                </p>
                <div className="lc-feature-chips">
                  <span className="lc-feature-chip">Button Text</span>
                  <span className="lc-feature-chip">Form Labels</span>
                  <span className="lc-feature-chip">Accessibility (ARIA)</span>
                </div>
              </div>

              {/* Feature 5: Smart Notification Scanning */}
              <div className="lc-feature-card">
                <div className="lc-feature-icon-wrap">
                  <Icon icon="mdi:message-alert-outline" width="24" height="24" />
                </div>
                <h3 className="lc-feature-title">Popup &amp; Notification Scanning</h3>
                <p className="lc-feature-desc">
                  Checks alerts, error banners, and toast popups. It intelligently flags user-facing messages while skipping technical status codes like "success" or "error".
                </p>
                <div className="lc-feature-chips">
                  <span className="lc-feature-chip">Toast Popups</span>
                  <span className="lc-feature-chip">Alert Banners</span>
                  <span className="lc-feature-chip">Error Messages</span>
                </div>
              </div>

              {/* Feature 6: Community Learning & False Positives */}
              <div className="lc-feature-card">
                <div className="lc-feature-icon-wrap">
                  <Icon icon="mdi:lightbulb-on-outline" width="24" height="24" />
                </div>
                <h3 className="lc-feature-title">Custom Rules &amp; Team Learning</h3>
                <p className="lc-feature-desc">
                  Easily customize what gets flagged. Teach the extension new patterns unique to your project, or quickly tell it to ignore specific technical terms with a single shortcut.
                </p>
                <div className="lc-feature-chips">
                  <span className="lc-feature-chip">Custom Project Rules</span>
                  <span className="lc-feature-chip">One-Key Ignore</span>
                  <span className="lc-feature-chip">Community Driven</span>
                </div>
              </div>
            </div>

            {/* Commands & Keyboard Shortcuts Reference Table */}
            <div className="section-divider" />
            <div className="showcase-section-header">
              <div className="showcase-badge-pill">
                <Icon icon="mdi:keyboard-outline" width="14" height="14" />
                <span>Quick Actions</span>
              </div>
              <h2 className="section-title">Commands &amp; Keyboard Shortcuts</h2>
              <p className="skills-subtitle">
                Speed up your localization workflow with these ready-to-use, customizable shortcuts:
              </p>
            </div>

            <div className="lc-commands-table-card">
              <div className="lc-table-responsive">
                <table className="lc-commands-table">
                  <thead>
                    <tr>
                      <th>Action &amp; Command</th>
                      <th>Windows &amp; Linux</th>
                      <th>macOS</th>
                      <th>Command ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {EXTENSION_COMMANDS.map((cmd) => (
                      <tr key={cmd.id} className={cmd.isAi ? 'row-ai-feature' : ''}>
                        <td>
                          <div className="lc-cmd-title-cell">
                            {cmd.isAi && (
                              <span className="lc-ai-pill-tag">
                                <Icon icon="logos:github-copilot" width="12" /> AI
                              </span>
                            )}
                            <strong>{cmd.name}</strong>
                          </div>
                          <div className="lc-cmd-table-desc">{cmd.desc}</div>
                        </td>
                        <td>
                          <kbd className="lc-kbd">{cmd.shortcutWin}</kbd>
                        </td>
                        <td>
                          <kbd className="lc-kbd">{cmd.shortcutMac}</kbd>
                        </td>
                        <td>
                          <div className="lc-cmd-copy-wrap">
                            <code>{cmd.id}</code>
                            <button
                              type="button"
                              className="lc-mini-copy-btn"
                              onClick={() => handleCopyCommand(cmd.id)}
                              title={`Copy ${cmd.id}`}
                            >
                              <Icon
                                icon={copiedCommand === cmd.id ? 'mdi:check' : 'mdi:content-copy'}
                                width="12"
                                height="12"
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Configuration Reference */}
            <div className="section-divider" />
            <div className="lc-reference-grid">
              {/* Settings Card */}
              <div className="lc-info-card" style={{ gridColumn: '1 / -1' }}>
                <div className="lc-info-header">
                  <h3 className="lc-info-title">
                    <Icon icon="mdi:tune" width="20" height="20" color="#f59e0b" />
                    <span>Workspace Settings Reference</span>
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
                  Add these optional settings to your project's <code>.vscode/settings.json</code> to customize scan behavior and dictionary paths:
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
                <span>Easy Setup</span>
              </div>
              <h2 className="section-title" style={{ marginTop: '0.5rem' }}>Get Started in Seconds</h2>
              <p className="skills-subtitle">
                Choose the installation method that best fits your workflow:
              </p>

              <div className="lc-install-grid">
                <div className="lc-install-option">
                  <span className="lc-opt-num">01 / QUICK CLI</span>
                  <h4 className="lc-opt-title">VS Code Terminal</h4>
                  <p className="lc-opt-desc">
                    Install the extension instantly with a single command in your terminal.
                  </p>
                  <div
                    className="lc-copy-snippet"
                    onClick={handleCopyInstall}
                    title={`Click to copy: ${VSCODE_INSTALL_CMD}`}
                  >
                    <span>{copiedInstallCmd ? 'Copied to clipboard!' : VSCODE_INSTALL_CMD}</span>
                    <Icon icon={copiedInstallCmd ? 'mdi:check' : 'mdi:content-copy'} width="14" height="14" />
                  </div>
                </div>

                <div className="lc-install-option">
                  <span className="lc-opt-num">02 / DOWNLOAD PACKAGE</span>
                  <h4 className="lc-opt-title">Manual VSIX Release</h4>
                  <p className="lc-opt-desc">
                    Download the pre-packaged <code>.vsix</code> file from GitHub Releases and install with one click in VS Code.
                  </p>
                  <a
                    href={releaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lc-copy-snippet"
                    style={{ textDecoration: 'none' }}
                    title="Download latest .vsix from GitHub Releases"
                  >
                    <span>Download Latest .vsix ({versionTag})</span>
                    <Icon icon="mdi:open-in-new" width="14" height="14" />
                  </a>
                </div>

                <div className="lc-install-option">
                  <span className="lc-opt-num">03 / OPEN SOURCE</span>
                  <h4 className="lc-opt-title">Develop from Source</h4>
                  <p className="lc-opt-desc">
                    Clone the open-source repository, run <code>npm install</code>, and test or contribute new features.
                  </p>
                  <div
                    className="lc-copy-snippet"
                    onClick={handleCopyClone}
                    title={`Click to copy: ${CLONE_CMD}`}
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
