import { useState, useEffect } from 'react';
import type { GitHubRepo } from '../types';

const USERNAME = 'PramudithaN';
const FEATURED_NAMES = ['11labsM', 'petrocast-backend', 'digital-wedding-invitation'];
const CONTRIBUTED_REPOS = ['arnabnandy7/openissue.dev', 'sameerasw/essentials'];

const FALLBACK_FEATURED: GitHubRepo[] = [
  {
    name: '11labsM',
    html_url: 'https://github.com/PramudithaN/11labsM',
    description: 'An automated localization and voice generation pipeline that translates English text into 17 languages and sequentially synthesizes high-quality audio using the ElevenLabs API.',
    stargazers_count: 0,
    forks_count: 0,
    updated_at: '2026-06-15T13:54:16Z',
    language: 'Python',
    topics: ['python', 'elevenlabs', 'automation', 'localization'],
    license: null
  },
  {
    name: 'petrocast-backend',
    html_url: 'https://github.com/PramudithaN/petrocast-backend',
    description: 'Production-grade FastAPI backend for crude oil price forecasting using a decomposition-based hybrid model (ARIMA + GRU + XGBoost) with strictly lagged live news sentiment integration from news sources.',
    stargazers_count: 2,
    forks_count: 0,
    updated_at: '2026-07-25T17:09:02Z',
    language: 'Python',
    topics: ['fastapi', 'machine-learning', 'forecasting', 'arima', 'gru'],
    license: { key: 'mit', name: 'MIT License' }
  },
  {
    name: 'digital-wedding-invitation',
    html_url: 'https://github.com/PramudithaN/digital-wedding-invitation',
    description: 'Interactive digital wedding invitation website built with React, Framer Motion, and Tailwind CSS.',
    stargazers_count: 0,
    forks_count: 0,
    updated_at: '2026-08-20T03:22:57Z',
    language: 'TypeScript',
    topics: ['react', 'framer-motion', 'tailwindcss', 'wedding'],
    license: { key: 'mit', name: 'MIT License' }
  }
];

const FALLBACK_OTHER: GitHubRepo[] = [
  {
    name: 'Vapi-Clone_FrontEnd',
    html_url: 'https://github.com/PramudithaN/Vapi-Clone_FrontEnd.git',
    description: 'Chatbot Management UI developed with Html and Css',
    stargazers_count: 2,
    forks_count: 0,
    updated_at: new Date().toISOString(),
    language: 'HTML',
    topics: ['Project']
  }
];

const FALLBACK_CONTRIBUTED: GitHubRepo[] = [
  {
    name: 'openissue.dev',
    full_name: 'arnabnandy7/openissue.dev',
    html_url: 'https://github.com/arnabnandy7/openissue.dev',
    description: 'An open source issue tracker',
    stargazers_count: 0,
    forks_count: 0,
    updated_at: new Date().toISOString(),
    language: 'TypeScript',
    topics: ['issue-tracker', 'open-source']
  },
  {
    name: 'essentials',
    full_name: 'sameerasw/essentials',
    html_url: 'https://github.com/sameerasw/essentials',
    description: 'Essentials utilities',
    stargazers_count: 0,
    forks_count: 0,
    updated_at: new Date().toISOString(),
    language: 'TypeScript',
    topics: []
  }
];


const EXCLUDED_NAMES = [
  'is-a-dev-register',
  'jarvis',
  'skills-introduction-to-repository-management',
  'skills-introduction-to-secret-scanning',
  'skills-secure-repository-supply-chain',
  'PramudithaN',
  'my-to-do-app',
  'Celestial-Routes-Figma',
  'Wavewatchers-Figma'
];

export function useGitHubRepos() {
  const [featuredRepos, setFeaturedRepos] = useState<GitHubRepo[]>([]);
  const [otherRepos, setOtherRepos] = useState<GitHubRepo[]>([]);
  const [contributedRepos, setContributedRepos] = useState<GitHubRepo[]>([]);
  const [loadingRepos, setLoadingRepos] = useState<boolean>(true);
  const [reposError, setReposError] = useState<boolean>(false);
  const [otherReposExpanded, setOtherReposExpanded] = useState(false);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const [res, ...contributedRes] = await Promise.all([
          fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`, {
            headers: { Accept: 'application/vnd.github.mercy-preview+json' }
          }),
          ...CONTRIBUTED_REPOS.map(repo => 
            fetch(`https://api.github.com/repos/${repo}`, {
              headers: { Accept: 'application/vnd.github.mercy-preview+json' }
            })
          )
        ]);

        if (!res.ok) {
          throw new Error('API request failed');
        }

        const rawRepos = await res.json();
        if (!Array.isArray(rawRepos)) {
          throw new Error('API response is not an array');
        }

        const filteredRaw: GitHubRepo[] = rawRepos.filter((r) => !EXCLUDED_NAMES.includes(r.name) && !r.fork);
        const featured = filteredRaw.filter((r) => FEATURED_NAMES.includes(r.name));

        // Supplement with fallbacks if any featured ones are not returned by the API
        const featuredWithFallbacks = [...featured];
        FEATURED_NAMES.forEach((name) => {
          if (!featuredWithFallbacks.some((f) => f.name === name)) {
            const fb = FALLBACK_FEATURED.find((f) => f.name === name);
            if (fb) featuredWithFallbacks.push(fb);
          }
        });

        // Sort featured by their index in FEATURED_NAMES
        featuredWithFallbacks.sort(
          (a, b) => FEATURED_NAMES.indexOf(a.name) - FEATURED_NAMES.indexOf(b.name)
        );

        const other = filteredRaw.filter((r) => !FEATURED_NAMES.includes(r.name));

        setFeaturedRepos(featuredWithFallbacks);
        setOtherRepos(other);

        // Process contributed repos
        const contributed = [];
        for (const cr of contributedRes) {
          if (cr.ok) {
            const data = await cr.json();
            contributed.push(data);
          }
        }
        setContributedRepos(contributed.length > 0 ? contributed : FALLBACK_CONTRIBUTED);

      } catch {
        setReposError(true);
        setFeaturedRepos(FALLBACK_FEATURED);
        setOtherRepos(FALLBACK_OTHER);
        setContributedRepos(FALLBACK_CONTRIBUTED);
      } finally {
        setLoadingRepos(false);
      }
    };

    fetchRepos();
  }, []);

  const displayedOtherRepos = otherReposExpanded ? otherRepos : otherRepos.slice(0, 6);

  const toggleOtherReposExpanded = () => {
    setOtherReposExpanded((prev) => !prev);
  };

  return {
    featuredRepos,
    otherRepos,
    contributedRepos,
    displayedOtherRepos,
    loadingRepos,
    reposError,
    otherReposExpanded,
    toggleOtherReposExpanded
  };
}
