#!/usr/bin/env node

/**
 * Universal Intelligent AI Agent Rules Generator
 * 
 * Deeply analyzes any codebase (Electron, React, Next.js, Vue, Svelte, Angular,
 * Node/Express, NestJS, FastAPI, Python, Rust, Go, Three.js, Turborepo, etc.)
 * and dynamically crafts tailored, high-standard AGENTS.md and GEMINI.md guidelines.
 * 
 * Usage:
 *   node scripts/generate-rules.mjs [optional-target-path]
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Safely validates and canonicalizes a directory path from CLI input.
 * Ensures the path contains no illegal characters and resolves to an existing directory.
 */
function getValidatedDirectory(inputPath, fallbackDir) {
  if (!inputPath || typeof inputPath !== 'string') {
    return path.resolve(fallbackDir)
  }

  // Reject dangerous characters, null bytes, or empty strings
  if (inputPath.includes('\0') || inputPath.trim() === '') {
    throw new Error('Invalid path: Contains illegal characters or empty string.')
  }

  // Canonicalize path
  const canonicalPath = path.resolve(process.cwd(), inputPath)

  // Validate that canonical path exists on filesystem and is a directory
  if (!fs.existsSync(canonicalPath)) {
    throw new Error(`Path does not exist: ${canonicalPath}`)
  }

  const stat = fs.statSync(canonicalPath)
  if (!stat.isDirectory()) {
    throw new Error(`Path is not a valid directory: ${canonicalPath}`)
  }

  return canonicalPath
}

const defaultRootDir = path.resolve(__dirname, '..')
const ROOT_DIR = getValidatedDirectory(process.argv[2], defaultRootDir)

// ── Directory Scanner & Tree Visualizer ──────────────────────────────────────
const IGNORED_DIRS = new Set([
  'node_modules', '.git', 'dist', 'dist-electron', 'dist-ssr',
  'build', 'release', '.next', '.nuxt', '.svelte-kit', '.astro',
  '.cache', '.turbo', '.vscode', '.idea', 'coverage', '__pycache__',
  'target', 'vendor', '.gemini', '.antigravity',
])

function generateDirectoryTree(dir, prefix = '', depth = 0, maxDepth = 2) {
  if (depth > maxDepth) return []
  
  let entries = []
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return []
  }

  const lines = []
  const filtered = entries
    .filter(e => !IGNORED_DIRS.has(e.name) && !e.name.startsWith('.DS_Store'))
    .sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) return -1
      if (!a.isDirectory() && b.isDirectory()) return 1
      return a.name.localeCompare(b.name)
    })

  for (let i = 0; i < filtered.length; i++) {
    const entry = filtered[i]
    const isLast = i === filtered.length - 1
    const pointer = isLast ? '└── ' : '├── '
    const nextPrefix = prefix + (isLast ? '    ' : '│   ')

    // Contextual directory annotations
    let annotation = ''
    if (entry.name === 'electron') annotation = '                 # Electron Main Process & Preload'
    else if (entry.name === 'src') annotation = '                      # Application Source Code'
    else if (entry.name === 'app') annotation = '                      # App Router / Application Core'
    else if (entry.name === 'pages') annotation = '                    # Page Views & Routing'
    else if (entry.name === 'public') annotation = '                   # Static Public Assets & Media'
    else if (entry.name === 'components') annotation = '           # Reusable UI & View Components'
    else if (entry.name === 'hooks') annotation = '                # Business Logic & State Hooks'
    else if (entry.name === 'services' || entry.name === 'api') annotation = '             # API Clients & Data Services'
    else if (entry.name === 'lib' || entry.name === 'utils') annotation = '                  # Utility Functions & Helper Libraries'
    else if (entry.name === 'types') annotation = '                # TypeScript Type Declarations'
    else if (entry.name === 'constants') annotation = '            # Configuration Constants & Registries'
    else if (entry.name === 'assets') annotation = '               # Media, 3D Models & Static Files'
    else if (entry.name === 'store' || entry.name === 'stores') annotation = '                # Global State Management'
    else if (entry.name === 'prisma') annotation = '                   # Prisma ORM Schema & Migrations'
    else if (entry.name === 'tests' || entry.name === '__tests__') annotation = '            # Test Suites & Specs'

    lines.push(`${prefix}${pointer}${entry.name}${annotation}`)

    if (entry.isDirectory()) {
      lines.push(...generateDirectoryTree(path.join(dir, entry.name), nextPrefix, depth + 1, maxDepth))
    }
  }

  return lines
}

// ── Deep Codebase & Tech Stack Analyzer ─────────────────────────────────────
function analyzeCodebase(rootDir) {
  // Read package.json if available
  const pkgPath = path.join(rootDir, 'package.json')
  let pkg = {}
  if (fs.existsSync(pkgPath)) {
    try {
      pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
    } catch {
      pkg = {}
    }
  }

  const allDeps = {
    ...(pkg.dependencies || {}),
    ...(pkg.devDependencies || {}),
  }

  const scripts = pkg.scripts || {}

  // Language & Runtime
  const hasTs = fs.existsSync(path.join(rootDir, 'tsconfig.json')) || !!allDeps['typescript']
  const hasPy = fs.existsSync(path.join(rootDir, 'pyproject.toml')) || fs.existsSync(path.join(rootDir, 'requirements.txt'))
  const hasRust = fs.existsSync(path.join(rootDir, 'Cargo.toml'))
  const hasGo = fs.existsSync(path.join(rootDir, 'go.mod'))

  // Desktop & Mobile Frameworks
  const isElectron = !!allDeps['electron'] || fs.existsSync(path.join(rootDir, 'electron'))
  const isTauri = !!allDeps['@tauri-apps/api'] || fs.existsSync(path.join(rootDir, 'src-tauri'))
  const isReactNative = !!allDeps['react-native'] || !!allDeps['expo']

  // Web Frontend Frameworks
  const isNext = !!allDeps['next']
  const isNextAppRouter = isNext && (fs.existsSync(path.join(rootDir, 'app')) || fs.existsSync(path.join(rootDir, 'src/app')))
  const isRemix = !!allDeps['@remix-run/react']
  const isAstro = !!allDeps['astro']
  const isNuxt = !!allDeps['nuxt']
  const isSvelteKit = !!allDeps['@sveltejs/kit'] || !!allDeps['svelte']
  const isVue = !!allDeps['vue'] || isNuxt
  const isAngular = !!allDeps['@angular/core']
  const isSolid = !!allDeps['solid-js']
  const isReact = !!allDeps['react'] || isNext || isRemix || isReactNative

  // 3D / Creative Tech
  const isThree = !!allDeps['three'] || !!allDeps['@react-three/fiber']
  const isR3F = !!allDeps['@react-three/fiber']
  const isDrei = !!allDeps['@react-three/drei']
  const isPixi = !!allDeps['pixi.js']

  // UI Libraries & Styling
  const isMui = !!allDeps['@mui/material'] || !!allDeps['@emotion/react']
  const isTailwind = !!allDeps['tailwindcss'] || fs.existsSync(path.join(rootDir, 'tailwind.config.js')) || fs.existsSync(path.join(rootDir, 'tailwind.config.ts'))
  const isShadcn = isTailwind && fs.existsSync(path.join(rootDir, 'components.json'))
  const isRadix = Object.keys(allDeps).some(k => k.startsWith('@radix-ui/'))
  const isChakra = !!allDeps['@chakra-ui/react']
  const isAntd = !!allDeps['antd']
  const isEmotion = !!allDeps['@emotion/styled'] || !!allDeps['@emotion/react']
  const isStyledComponents = !!allDeps['styled-components']

  // State Management
  const isRedux = !!allDeps['@reduxjs/toolkit'] || !!allDeps['redux']
  const isZustand = !!allDeps['zustand']
  const isJotai = !!allDeps['jotai']
  const isTanstackQuery = !!allDeps['@tanstack/react-query'] || !!allDeps['react-query']
  const isPinia = !!allDeps['pinia']

  // Backend & Database
  const isNest = !!allDeps['@nestjs/core']
  const isExpress = !!allDeps['express']
  const isFastify = !!allDeps['fastify']
  const isHono = !!allDeps['hono']
  const isPrisma = !!allDeps['@prisma/client'] || fs.existsSync(path.join(rootDir, 'prisma'))
  const isDrizzle = !!allDeps['drizzle-orm']
  const isSupabase = !!allDeps['@supabase/supabase-js']
  const isFirebase = !!allDeps['firebase'] || !!allDeps['firebase-admin']

  // Testing & Quality Tools
  const isVitest = !!allDeps['vitest']
  const isJest = !!allDeps['jest']
  const isPlaywright = !!allDeps['@playwright/test']
  const isCypress = !!allDeps['cypress']
  const isEslint = !!allDeps['eslint'] || fs.existsSync(path.join(rootDir, '.eslintrc.cjs')) || fs.existsSync(path.join(rootDir, '.eslintrc.json'))

  // Bundlers & Build
  const isVite = !!allDeps['vite'] || fs.existsSync(path.join(rootDir, 'vite.config.ts')) || fs.existsSync(path.join(rootDir, 'vite.config.js'))
  const isWebpack = !!allDeps['webpack']
  const isTurborepo = !!allDeps['turbo'] || fs.existsSync(path.join(rootDir, 'turbo.json'))
  const isElectronBuilder = !!allDeps['electron-builder'] || fs.existsSync(path.join(rootDir, 'electron-builder.json5'))

  // Metadata
  const baseName = path.basename(rootDir)
  const projectName = pkg.name || baseName
  let description = pkg.description

  if (!description) {
    if (isElectron) description = 'A high-performance desktop application built with Electron, React, and TypeScript.'
    else if (isNext) description = 'A modern full-stack web application powered by Next.js and React.'
    else if (isReact && isVite) description = 'A fast, modern React single-page application built with Vite and TypeScript.'
    else if (hasPy) description = 'A robust Python application and backend service.'
    else if (hasRust) description = 'A high-performance, memory-safe Rust system application.'
    else if (hasGo) description = 'A scalable Go cloud and backend application.'
    else description = 'A modern, modular software application and codebase.'
  }

  return {
    projectName,
    baseName,
    description,
    pkg,
    scripts,
    hasTs,
    hasPy,
    hasRust,
    hasGo,
    isElectron,
    isTauri,
    isReactNative,
    isNext,
    isNextAppRouter,
    isRemix,
    isAstro,
    isNuxt,
    isSvelteKit,
    isVue,
    isAngular,
    isSolid,
    isReact,
    isThree,
    isR3F,
    isDrei,
    isPixi,
    isMui,
    isTailwind,
    isShadcn,
    isRadix,
    isChakra,
    isAntd,
    isEmotion,
    isStyledComponents,
    isRedux,
    isZustand,
    isJotai,
    isTanstackQuery,
    isPinia,
    isNest,
    isExpress,
    isFastify,
    isHono,
    isPrisma,
    isDrizzle,
    isSupabase,
    isFirebase,
    isVitest,
    isJest,
    isPlaywright,
    isCypress,
    isEslint,
    isVite,
    isWebpack,
    isTurborepo,
    isElectronBuilder,
  }
}

// ── Dynamic Rule Formulators ────────────────────────────────────────────────

function formatProjectOverview(info) {
  const stack = []
  if (info.isElectron) stack.push('**Electron**')
  if (info.isTauri) stack.push('**Tauri**')
  if (info.isNext) stack.push(`**Next.js (${info.isNextAppRouter ? 'App Router' : 'Pages Router'})**`)
  else if (info.isRemix) stack.push('**Remix**')
  else if (info.isAstro) stack.push('**Astro**')
  else if (info.isNuxt) stack.push('**Nuxt**')
  else if (info.isSvelteKit) stack.push('**SvelteKit**')
  else if (info.isReact) stack.push('**React 18**')
  else if (info.isVue) stack.push('**Vue 3**')
  else if (info.isAngular) stack.push('**Angular**')
  else if (info.isSolid) stack.push('**SolidJS**')

  if (info.hasTs) stack.push('**TypeScript**')
  else if (info.hasPy) stack.push('**Python**')
  else if (info.hasRust) stack.push('**Rust**')
  else if (info.hasGo) stack.push('**Go**')

  if (info.isVite) stack.push('**Vite**')
  if (info.isThree || info.isR3F) stack.push('**Three.js / React Three Fiber**')
  if (info.isMui) stack.push('**Material UI (MUI)**')
  if (info.isShadcn) stack.push('**Shadcn UI**')
  else if (info.isTailwind) stack.push('**Tailwind CSS**')
  if (info.isPrisma) stack.push('**Prisma ORM**')
  if (info.isSupabase) stack.push('**Supabase**')
  if (info.isZustand) stack.push('**Zustand**')
  else if (info.isRedux) stack.push('**Redux Toolkit**')

  return `**${info.projectName}** is a modern application built with ${stack.join(', ')}.\n\n` +
    `> ${info.description}`
}

function formatCodingStandards(info) {
  const points = []

  // 1. Language & Clean Code
  if (info.hasTs) {
    points.push(`1. **Senior Developer Excellence:**\n` +
      `   - Write clean, expressive, and modular TypeScript code.\n` +
      `   - Follow strict separation of concerns across state, business logic, UI presentation, and platform APIs.`)
    
    if (info.isElectron) {
      points.push(`   - Maintain a strict boundary between the Electron **Main Process** (system tray, windows, display management, login items) and the **Renderer Process** (React UI, Three.js 3D scene, Web Audio synthesis).\n` +
        `   - Never import Node.js core modules (\`fs\`, \`path\`, \`child_process\`) directly inside \`src/\`. All desktop interactions must flow through the preload bridge (\`electron/preload.ts\`).`)
    } else if (info.isNextAppRouter) {
      points.push(`   - Maintain a clear distinction between **React Server Components (RSC)** (default) and **Client Components** (\`'use client'\`).\n` +
        `   - Keep data fetching, database access, and secure secrets inside Server Components or Server Actions.`)
    }

    points.push(`2. **TypeScript & Strict Typing:**\n` +
      `   - Never use \`any\`. Always declare explicit interfaces, type unions, and type aliases.\n` +
      (info.isElectron ? `   - Maintain strict typing for all IPC channels in \`src/types/electron.d.ts\` and \`electron/main.ts\`.\n` : '') +
      `   - Ensure linting and TypeScript compilation pass with 0 errors or warnings.`)
  } else if (info.hasPy) {
    points.push(`1. **Senior Python Architecture:**\n` +
      `   - Follow PEP 8 style standards and strict type annotations (\`typing\`, \`pydantic\`).\n` +
      `   - Use clear dependency injection, modular services, and structured exception handling.`)
  } else if (info.hasRust) {
    points.push(`1. **Idiomatic Rust Engineering:**\n` +
      `   - Adhere to idiomatic Rust principles: proper ownership, borrowing, and zero unnecessary \`clone()\` or \`unwrap()\`. Use structured \`Result\` / \`Option\` handling with \`?\`.`)
  } else {
    points.push(`1. **Senior Developer Standards:**\n` +
      `   - Write clean, modular, and self-documenting code with comprehensive separation of concerns.`)
  }

  // 2. DRY & Architecture
  points.push(`3. **DRY & Single Responsibility:**\n` +
    `   - Decompose monolithic files into focused, reusable components, hooks, or service utilities.\n` +
    `   - Separate state persistence, business logic, presentation components, and external integrations.`)

  // 3. 3D & Heavy Asset Performance
  if (info.isThree || info.isR3F) {
    points.push(`4. **Resilient 3D & Audio Performance:**\n` +
      `   - Always wrap 3D asset loaders (\`useGLTF\`, \`useAnimations\`) in React \`<Suspense>\` and \`<ModelErrorBoundary>\` boundaries with graceful fallbacks.\n` +
      `   - Preload all 3D models using \`useGLTF.preload()\` at module load to prevent stutter during rendering triggers.\n` +
      `   - Properly dispose of Three.js geometries, textures, materials, and Web Audio context nodes upon component unmount to prevent memory leaks in long-running processes.`)
  }

  return points.join('\n')
}

function formatFrameworkRules(info) {
  const sections = []

  if (info.isElectron) {
    sections.push(`### Electron Desktop & Overlay Guidelines:\n` +
      `1. **Transparent Overlay & Pointer Events:**\n` +
      `   - When idle or minimized, ensure the window ignores mouse events (\`win.setIgnoreMouseEvents(true, { forward: true })\`) so user interactions pass through to background desktop applications.\n` +
      `   - When an interactive dialog, reminder, or modal triggers, enable pointer events (\`win.setIgnoreMouseEvents(false)\`).\n` +
      `2. **Multi-Monitor Display Routing:**\n` +
      `   - Dynamically detect active cursor coordinates (\`screen.getCursorScreenPoint()\`) and route overlays to the nearest monitor display bounds (\`screen.getDisplayNearestPoint()\`).\n` +
      `3. **System Tray & Single-Instance Lifecycle:**\n` +
      `   - Enforce single instance locking (\`app.requestSingleInstanceLock()\`).\n` +
      `   - Keep tray context menus synchronized with live application state (mute status, startup preferences).`)
  }

  if (info.isNext) {
    sections.push(`### Next.js & React Architecture Guidelines:\n` +
      `1. **Server vs Client Components:**\n` +
      `   - Keep component trees as server components by default. Push \`'use client'\` to the leaves of the tree where interactivity, hooks, or browser APIs are needed.\n` +
      `2. **Optimized Data Fetching & Caching:**\n` +
      `   - Utilize \`fetch\` cache tags and \`revalidateTag\` for granular cache invalidation.\n` +
      `   - Never perform expensive database queries directly in client-side effects.`)
  }

  if (info.isMui || info.isTailwind || info.isShadcn) {
    sections.push(`### UI/UX Design System:\n` +
      `1. **Consistent Visual Aesthetic:**\n` +
      `   - Maintain high-contrast, dark-mode developer aesthetics (#101010 background, vibrant accent colors, crisp monospace typography: \`"Fira Code", "Consolas", "Inter", monospace\`).\n` +
      `   - Use subtle backdrop blurs (\`backdrop-filter: blur(6px)\`) with smooth CSS transitions.`)
  }

  if (info.isPrisma || info.isDrizzle || info.isSupabase) {
    sections.push(`### Database & Persistence Guidelines:\n` +
      `1. **Schema & Query Integrity:**\n` +
      `   - Validate all database mutations using schema parsers (e.g. Zod / TypeBox).\n` +
      `   - Ensure proper indexes on frequently queried relations and foreign keys.`)
  }

  return sections.length > 0 ? sections.join('\n\n') : `Follow standard idiomatic ${info.isReact ? 'React' : 'software'} design patterns and component modularity.`
}

function formatSecurityRules(info) {
  const points = []

  if (info.isElectron) {
    points.push(`1. **Context Isolation & Sandboxing:**\n` +
      `   - Enforce \`contextIsolation: true\`, \`nodeIntegration: false\`, and \`sandbox: false\` in \`BrowserWindow\` \`webPreferences\`.\n` +
      `   - Never expose raw Node.js modules directly to the renderer.\n` +
      `   - Only expose safe, strictly whitelisted IPC methods via \`contextBridge.exposeInMainWorld('ipcRenderer', ...)\`.\n` +
      `2. **IPC Message Validation:**\n` +
      `   - Validate and sanitize all arguments received by \`ipcMain.on\` and \`ipcMain.handle\`.\n` +
      `   - Never trust input from the renderer to execute arbitrary shell commands, load unverified URLs, or write to arbitrary filesystem paths.`)
  } else {
    points.push(`1. **Zero Exposed Secrets & Environment Validation:**\n` +
      `   - Never hardcode private API keys, database credentials, or sensitive secrets in client-accessible files.\n` +
      `   - Validate all runtime environment variables at startup.`)
  }

  if (info.isSupabase) {
    points.push(`2. **Row-Level Security (RLS) & Authorization:**\n` +
      `   - Ensure all database tables enforce strict Row-Level Security (RLS) policies.\n` +
      `   - Never rely solely on client-side state for backend authorization.`)
  }

  if (info.isThree || info.isElectron) {
    points.push(`3. **Safe Asset & Media Handling:**\n` +
      `   - 3D models (\`.glb\`) and static media must be bundled locally or loaded from verified internal paths.\n` +
      `   - Synthesize reminder chimes procedurally using the Web Audio API (\`AudioContext\`, \`OscillatorNode\`, \`GainNode\`) without downloading untrusted external audio files.`)
  }

  points.push(`4. **Clean Build Artifacts:**\n` +
    `   - Keep build artifacts (\`dist\`, \`dist-electron\`, \`release\`, \`node_modules\`, \`.next\`) ignored in \`.gitignore\`.`)

  return points.join('\n')
}

function formatVerificationRunbook(info) {
  const steps = []
  let stepNumber = 1

  if (info.scripts['lint']) {
    steps.push(`${stepNumber++}. **Lint Check:**\n   \`\`\`bash\n   npm run lint\n   \`\`\`\n   *Must exit with code 0.*`)
  }

  if (info.hasTs) {
    steps.push(`${stepNumber++}. **TypeScript Compilation:**\n   \`\`\`bash\n   npx tsc --noEmit\n   \`\`\`\n   *Must compile with zero TypeScript errors.*`)
  }

  if (info.scripts['build']) {
    steps.push(`${stepNumber++}. **Production Build:**\n   \`\`\`bash\n   ${info.isVite ? 'npx vite build' : 'npm run build'}\n   \`\`\`\n   *Must bundle cleanly with zero build errors.*`)
  }

  if (info.scripts['test'] || info.isVitest || info.isJest) {
    steps.push(`${stepNumber++}. **Test Suite:**\n   \`\`\`bash\n   npm test\n   \`\`\`\n   *All unit & integration tests must pass.*`)
  }

  return steps.join('\n\n')
}

// ── Built-in Master Template (Fallback & Standard) ──────────────────────────
const MASTER_TEMPLATE = `# Senior Developer & Security Guidelines (Coding Agent Instructions)

> **CRITICAL INSTRUCTION FOR ALL AI CODING AGENTS**:
> Whenever you analyze, plan, edit, or refactor code in this repository (**{{PROJECT_NAME}}**), you must **strictly adhere** to all architectural best practices, security standards, UI/UX conventions, documentation maintenance, and commit conventions detailed in this document.

---

## 1. Project Overview & Architecture

{{PROJECT_OVERVIEW}}

### Project Structure & Separation of Concerns:
\`\`\`text
{{PROJECT_STRUCTURE}}
\`\`\`

---

## 2. Professional Mindset & Clean Code Standards

{{CODING_STANDARDS}}

---

## 3. Framework & Technical Guidelines

{{FRAMEWORK_SPECIFIC_RULES}}

---

## 4. Zero-Vulnerability & Cybersecurity Principles

{{SECURITY_RULES}}

---

## 5. Continuous Documentation Maintenance (README Sync)

1. **Keep Documentation Synchronized:**
   - Whenever adding new features, components, architecture changes, settings options, or build requirements, **you must update \`README.md\`** to reflect the changes.
   - Keep technology stack listings, installation/build instructions, and environment variable notes completely accurate.

---

## 6. Standard Git Commit Message Conventions

All commit messages in this project must follow the standard **Conventional Commits** specification:

### Format:
\`\`\`text
<type>(<scope>): <short description in imperative mood>
\`\`\`

### Commit Types:
* \`feat(scope):\` -> A new feature or user-facing capability (e.g. \`feat(models): add animated cyber samurai 3D model\`).
* \`fix(scope):\` -> A bug fix or error correction (e.g. \`fix(tray): update mute icon on tray menu toggle\`).
* \`perf(scope):\` -> Performance improvement (e.g. \`perf(three): dispose unused textures on model swap\`).
* \`refactor(scope):\` -> Code restructuring without changing functional behavior (e.g. \`refactor(timers): extract interval calculation helper\`).
* \`security(scope):\` -> Security hardening or IPC sanitization (e.g. \`security(ipc): validate payload structure in main process\`).
* \`style(scope):\` -> Styling, theme, or layout tweaks (e.g. \`style(settings): refine slider contrast for dark theme\`).
* \`docs(scope):\` -> Documentation updates (e.g. \`docs(readme): document new stretch break intervals\`).
* \`chore(scope):\` -> Maintenance, dependencies, build configuration (e.g. \`chore(deps): update electron to latest patch release\`).

---

## 7. Verification & Quality Assurance Runbook

Before completing any coding task, the agent must run and verify all of the following:

{{VERIFICATION_RUNBOOK}}
`

// ── Auto-update .gitignore to ignore generated AI Agent rule files ────────────
function ensureGitignore(rootDir, entries = ['AGENTS.md', 'GEMINI.md', 'templates/']) {
  const gitignorePath = path.join(rootDir, '.gitignore')
  let currentContent = ''
  if (fs.existsSync(gitignorePath)) {
    currentContent = fs.readFileSync(gitignorePath, 'utf8')
  }

  const missing = entries.filter(entry => {
    const pattern = entry.replace('/', '')
    const regex = new RegExp(`(^|\\n)\\s*${pattern}(\\/)?\\s*($|\\n)`, 'm')
    return !regex.test(currentContent)
  })

  if (missing.length > 0) {
    const block = `\n# AI Agent rule & template files (per-repo local generated)\n${missing.join('\n')}\n`
    fs.writeFileSync(gitignorePath, currentContent + (currentContent.endsWith('\n') ? '' : '\n') + block, 'utf8')
    console.log(`[generate-rules] 🛡️ Added to .gitignore: ${missing.join(', ')}`)
  }
}

// ── Generator Orchestration ─────────────────────────────────────────────────
export function generateRules(rootDir = ROOT_DIR) {
  console.log(`[generate-rules] 🔍 Analyzing codebase at: ${rootDir}`)
  const info = analyzeCodebase(rootDir)

  const treeLines = [info.baseName + '/', ...generateDirectoryTree(rootDir)]
  const projectStructure = treeLines.join('\n')

  const overview = formatProjectOverview(info)
  const codingStandards = formatCodingStandards(info)
  const frameworkRules = formatFrameworkRules(info)
  const securityRules = formatSecurityRules(info)
  const verificationRunbook = formatVerificationRunbook(info)

  const replacements = {
    '{{PROJECT_NAME}}': info.projectName,
    '{{PROJECT_OVERVIEW}}': overview,
    '{{PROJECT_STRUCTURE}}': projectStructure,
    '{{CODING_STANDARDS}}': codingStandards,
    '{{FRAMEWORK_SPECIFIC_RULES}}': frameworkRules,
    '{{SECURITY_RULES}}': securityRules,
    '{{VERIFICATION_RUNBOOK}}': verificationRunbook,
  }

  const targets = [
    { templateName: 'AGENTS.template.md', outputName: 'AGENTS.md' },
    { templateName: 'GEMINI.template.md', outputName: 'GEMINI.md' },
  ]

  const templatesDir = path.join(rootDir, 'templates')

  for (const { templateName, outputName } of targets) {
    const templatePath = path.join(templatesDir, templateName)
    let content = ''

    if (fs.existsSync(templatePath)) {
      content = fs.readFileSync(templatePath, 'utf8')
    } else {
      content = MASTER_TEMPLATE
    }

    for (const [placeholder, value] of Object.entries(replacements)) {
      content = content.replaceAll(placeholder, value)
    }

    const outputPath = path.join(rootDir, outputName)
    fs.writeFileSync(outputPath, content, 'utf8')
    console.log(`[generate-rules] ✨ Generated ${outputName} customized for ${info.projectName}`)
  }

  // Ensure generated markdown files and templates are in .gitignore
  ensureGitignore(rootDir)

  console.log(`[generate-rules] ✅ Completed AI agent rule generation successfully!`)
}

// Run if invoked directly from CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateRules(ROOT_DIR)
}
