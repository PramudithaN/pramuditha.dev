import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import {
  type PortfolioContent,
  type TestimonialItem,
  type ExperienceItem,
  type AestheticsExperienceItem,
  type ShowcaseReel,
  extractYouTubeThumbnail,
  getBestYouTubeThumbnail,
  getStoredContent,
  saveStoredContent,
  resetStoredContent,
  exportContentJSON,
  importContentJSON,
  isAdminAuthenticated,
  loginAdmin,
  logoutAdmin
} from '../../services/contentStore';
import { isSupabaseConfigured } from '../../services/supabaseClient';

interface AdminPanelProps {
  onNavigateHome: () => void;
  onNavigateLogic?: () => void;
  onNavigateAesthetics?: () => void;
}

type AdminTab =
  | 'logic-testimonials'
  | 'logic-journey'
  | 'aesthetics-testimonials'
  | 'aesthetics-journey'
  | 'aesthetics-videos'
  | 'settings';

export default function AdminPanel({ onNavigateHome }: AdminPanelProps) {
  const isCloudActive = isSupabaseConfigured();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  const [currentTab, setCurrentTab] = useState<AdminTab>('logic-testimonials');
  const [content, setContent] = useState<PortfolioContent>(getStoredContent());
  const [toastMessage, setToastMessage] = useState<string>('');

  // Modals / Editing States
  const [editingTestimonial, setEditingTestimonial] = useState<{
    type: 'logic' | 'aesthetics';
    item: TestimonialItem | null;
  } | null>(null);

  const [editingExperience, setEditingExperience] = useState<{
    item: ExperienceItem | null;
    rawTech: string;
  } | null>(null);

  const [editingAestheticsExperience, setEditingAestheticsExperience] = useState<{
    item: AestheticsExperienceItem | null;
  } | null>(null);

  const [editingVideoReel, setEditingVideoReel] = useState<{
    item: ShowcaseReel | null;
    rawTags: string;
  } | null>(null);

  // Settings states
  const [importJsonText, setImportJsonText] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    isAdminAuthenticated().then((authed) => setIsAuthenticated(authed));
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsLoggingIn(true);

    try {
      const res = await loginAdmin(email, password);
      if (res.success) {
        setIsAuthenticated(true);
        setAuthError('');
        setPassword('');
        setEmail('');
        showToast('Welcome back, Admin! (Connected to Supabase)');
      } else {
        setAuthError(res.error || 'Authentication failed. Please check your credentials.');
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Login error occurred.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    setIsAuthenticated(false);
    showToast('Logged out successfully.');
  };

  const handleSaveData = (newContent: PortfolioContent, message: string) => {
    setContent(newContent);
    saveStoredContent(newContent, true);
    showToast(isCloudActive ? `${message} (Synced to Cloud)` : message);
  };

  // --- TESTIMONIAL HANDLERS ---
  const handleSaveTestimonial = (item: TestimonialItem, type: 'logic' | 'aesthetics') => {
    const key = type === 'logic' ? 'logicTestimonials' : 'aestheticsTestimonials';
    const list = [...content[key]];
    const index = list.findIndex(t => t.id === item.id);

    if (index >= 0) {
      list[index] = item;
    } else {
      list.unshift(item);
    }

    handleSaveData({ ...content, [key]: list }, `${type === 'logic' ? 'Logic' : 'Aesthetics'} testimonial saved!`);
    setEditingTestimonial(null);
  };

  const handleDeleteTestimonial = (id: string, type: 'logic' | 'aesthetics') => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
    const key = type === 'logic' ? 'logicTestimonials' : 'aestheticsTestimonials';
    const list = content[key].filter(t => t.id !== id);
    handleSaveData({ ...content, [key]: list }, 'Testimonial deleted.');
  };

  const handleMoveTestimonial = (index: number, direction: 'up' | 'down', type: 'logic' | 'aesthetics') => {
    const key = type === 'logic' ? 'logicTestimonials' : 'aestheticsTestimonials';
    const list = [...content[key]];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    handleSaveData({ ...content, [key]: list }, 'Testimonial order updated.');
  };

  // --- LOGIC EXPERIENCE HANDLERS ---
  const handleSaveExperience = (item: ExperienceItem) => {
    const list = [...content.logicExperience];
    const index = list.findIndex(e => e.id === item.id);

    if (index >= 0) {
      list[index] = item;
    } else {
      list.unshift(item);
    }

    handleSaveData({ ...content, logicExperience: list }, 'Developer Journey experience saved!');
    setEditingExperience(null);
  };

  const handleDeleteExperience = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this experience entry?')) return;
    const list = content.logicExperience.filter(e => e.id !== id);
    handleSaveData({ ...content, logicExperience: list }, 'Experience deleted.');
  };

  const handleMoveExperience = (index: number, direction: 'up' | 'down') => {
    const list = [...content.logicExperience];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    handleSaveData({ ...content, logicExperience: list }, 'Experience order updated.');
  };

  const handleToggleExperienceVisibility = (id: string) => {
    const list = content.logicExperience.map(e => e.id === id ? { ...e, hidden: !e.hidden } : e);
    const target = list.find(e => e.id === id);
    handleSaveData(
      { ...content, logicExperience: list },
      target?.hidden ? 'Experience hidden from website.' : 'Experience is now visible on website.'
    );
  };

  // --- AESTHETICS EXPERIENCE HANDLERS ---
  const handleSaveAestheticsExperience = (item: AestheticsExperienceItem) => {
    const list = [...content.aestheticsExperience];
    const index = list.findIndex(e => e.id === item.id);

    if (index >= 0) {
      list[index] = item;
    } else {
      list.unshift(item);
    }

    handleSaveData({ ...content, aestheticsExperience: list }, 'Creative Journey experience saved!');
    setEditingAestheticsExperience(null);
  };

  const handleDeleteAestheticsExperience = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this creative experience?')) return;
    const list = content.aestheticsExperience.filter(e => e.id !== id);
    handleSaveData({ ...content, aestheticsExperience: list }, 'Creative experience deleted.');
  };

  const handleMoveAestheticsExperience = (index: number, direction: 'up' | 'down') => {
    const list = [...content.aestheticsExperience];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    handleSaveData({ ...content, aestheticsExperience: list }, 'Creative experience order updated.');
  };

  const handleToggleAestheticsExperienceVisibility = (id: string) => {
    const list = content.aestheticsExperience.map(e => e.id === id ? { ...e, hidden: !e.hidden } : e);
    const target = list.find(e => e.id === id);
    handleSaveData(
      { ...content, aestheticsExperience: list },
      target?.hidden ? 'Creative experience hidden from website.' : 'Creative experience is now visible on website.'
    );
  };

  // --- VIDEO REELS HANDLERS ---
  const handleSaveVideoReel = (item: ShowcaseReel) => {
    const list = [...(content.videoReels || [])];
    const index = list.findIndex(v => v.id === item.id);

    if (index >= 0) {
      list[index] = item;
    } else {
      list.unshift(item);
    }

    handleSaveData({ ...content, videoReels: list }, 'Video Showcase reel saved!');
    setEditingVideoReel(null);
  };

  const handleDeleteVideoReel = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this video reel?')) return;
    const list = (content.videoReels || []).filter(v => v.id !== id);
    handleSaveData({ ...content, videoReels: list }, 'Video reel deleted.');
  };

  const handleMoveVideoReel = (index: number, direction: 'up' | 'down') => {
    const list = [...(content.videoReels || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    handleSaveData({ ...content, videoReels: list }, 'Video reel order updated.');
  };

  // --- SETTINGS HANDLERS ---
  const handleResetToDefaults = () => {
    if (window.confirm('WARNING: This will reset all testimonials, journeys, and video reels back to factory defaults. Continue?')) {
      const resetData = resetStoredContent();
      setContent(resetData);
      showToast('Content successfully reset to default portfolio data.');
    }
  };

  const handleExport = () => {
    const json = exportContentJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-content-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup JSON exported!');
  };

  const handleImport = () => {
    if (!importJsonText.trim()) return;
    const res = importContentJSON(importJsonText);
    if (res.success) {
      setContent(getStoredContent());
      setImportJsonText('');
      showToast('Backup JSON successfully imported!');
    } else {
      alert(`Import error: ${res.error}`);
    }
  };

  const sqlSchemaSnippet = `-- 1. Create table for portfolio content
create table if not exists portfolio_content (
  id text primary key,
  data jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Enable Row Level Security (RLS)
alter table portfolio_content enable row level security;

-- 3. Policy: Public visitors can view the portfolio
create policy "Public can read portfolio content"
  on portfolio_content for select
  using (true);

-- 4. Policy: Authenticated admin can save edits
create policy "Admin can modify portfolio content"
  on portfolio_content for all
  using (auth.role() = 'authenticated');`;

  const copySqlSnippet = () => {
    navigator.clipboard.writeText(sqlSchemaSnippet);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
    showToast('SQL Schema copied to clipboard!');
  };

  // --- RENDER: LOGIN FORM IF NOT AUTHENTICATED ---
  if (!isAuthenticated) {
    return (
      <div className="admin-login-wrapper">
        <div className="admin-login-box">
          <div className="admin-lock-icon-wrap">
            <Icon icon="mdi:cloud-lock-outline" className="admin-lock-icon" />
          </div>
          <h2 className="admin-login-title">Admin Dashboard</h2>
          <p className="admin-login-desc">
            Log in with your <strong>Supabase Admin Account</strong> to manage testimonials, journeys &amp; video showcase.
          </p>

          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="admin-form-group">
              <label className="admin-input-label">Admin Email</label>
              <input
                type="email"
                className="admin-input"
                placeholder="e.g. admin@pramuditha.dev"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                required
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-input-label">Admin Password</label>
              <input
                type="password"
                className="admin-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {authError && <div className="admin-error-text">{authError}</div>}
            
            <button type="submit" disabled={isLoggingIn} className="admin-primary-btn login-btn">
              <span>{isLoggingIn ? 'Verifying...' : 'Sign In with Supabase'}</span>
              <Icon icon="mdi:arrow-right" />
            </button>
          </form>

          <div className="admin-login-footer">
            <button type="button" onClick={onNavigateHome} className="admin-link-btn">
              ‹ Back to Portfolio
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER: AUTHENTICATED DASHBOARD ---
  return (
    <div className="admin-dashboard-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="admin-toast">
          <Icon icon="mdi:check-circle-outline" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="admin-top-header">
        <div className="admin-header-brand">
          <div className={`admin-badge-dot ${isCloudActive ? 'cloud' : ''}`}></div>
          <div>
            <div className="admin-title-row">
              <h1 className="admin-header-title">Portfolio Manager</h1>
              {isCloudActive ? (
                <span className="admin-cloud-badge active">
                  <Icon icon="mdi:cloud-check" />
                  <span>Supabase Live Sync</span>
                </span>
              ) : (
                <span className="admin-cloud-badge offline">
                  <Icon icon="mdi:database-outline" />
                  <span>Supabase Disconnected</span>
                </span>
              )}
            </div>
            <span className="admin-header-sub">Logic &amp; Aesthetics Control Panel</span>
          </div>
        </div>

        <div className="admin-header-actions">
          <button type="button" onClick={onNavigateHome} className="admin-header-btn">
            <Icon icon="mdi:home-outline" />
            <span>View Site</span>
          </button>
          <button type="button" onClick={handleLogout} className="admin-header-btn logout">
            <Icon icon="mdi:logout" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="admin-tab-bar">
        <button
          type="button"
          className={`admin-tab-item ${currentTab === 'logic-testimonials' ? 'active' : ''}`}
          onClick={() => setCurrentTab('logic-testimonials')}
        >
          <Icon icon="mdi:code-tags" />
          <span>Logic Testimonials</span>
          <span className="admin-tab-count">{content.logicTestimonials.length}</span>
        </button>

        <button
          type="button"
          className={`admin-tab-item ${currentTab === 'logic-journey' ? 'active' : ''}`}
          onClick={() => setCurrentTab('logic-journey')}
        >
          <Icon icon="mdi:timeline-text-outline" />
          <span>Logic Journey</span>
          <span className="admin-tab-count">{content.logicExperience.length}</span>
        </button>

        <button
          type="button"
          className={`admin-tab-item ${currentTab === 'aesthetics-videos' ? 'active' : ''}`}
          onClick={() => setCurrentTab('aesthetics-videos')}
        >
          <Icon icon="mdi:video-vintage" />
          <span>Video Reels</span>
          <span className="admin-tab-count">{(content.videoReels || []).length}</span>
        </button>

        <button
          type="button"
          className={`admin-tab-item ${currentTab === 'aesthetics-testimonials' ? 'active' : ''}`}
          onClick={() => setCurrentTab('aesthetics-testimonials')}
        >
          <Icon icon="mdi:palette-outline" />
          <span>Aesthetics Feedback</span>
          <span className="admin-tab-count">{content.aestheticsTestimonials.length}</span>
        </button>

        <button
          type="button"
          className={`admin-tab-item ${currentTab === 'aesthetics-journey' ? 'active' : ''}`}
          onClick={() => setCurrentTab('aesthetics-journey')}
        >
          <Icon icon="mdi:movie-open-outline" />
          <span>Creative Journey</span>
          <span className="admin-tab-count">{content.aestheticsExperience.length}</span>
        </button>

        <button
          type="button"
          className={`admin-tab-item ${currentTab === 'settings' ? 'active' : ''}`}
          onClick={() => setCurrentTab('settings')}
        >
          <Icon icon="mdi:cog-outline" />
          <span>Settings &amp; Supabase</span>
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="admin-main-content">
        {/* TAB 1: LOGIC TESTIMONIALS */}
        {currentTab === 'logic-testimonials' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <div>
                <h2 className="admin-section-heading">Logic &amp; Systems Testimonials</h2>
                <p className="admin-section-subheading">Manage peer reviews and recommendations on the Logic subpage.</p>
              </div>
              <button
                type="button"
                className="admin-primary-btn"
                onClick={() =>
                  setEditingTestimonial({
                    type: 'logic',
                    item: {
                      id: `log-test-${Date.now()}`,
                      name: '',
                      role: '',
                      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=P`,
                      text: ''
                    }
                  })
                }
              >
                <Icon icon="mdi:plus" />
                <span>Add Testimonial</span>
              </button>
            </div>

            <div className="admin-cards-list">
              {content.logicTestimonials.length === 0 ? (
                <div className="admin-empty-state">No testimonials found. Click "Add Testimonial" to create one.</div>
              ) : (
                content.logicTestimonials.map((t, idx) => (
                  <div key={t.id} className="admin-card-item">
                    <div className="admin-card-header">
                      <div className="admin-avatar-preview">
                        <img src={t.avatarUrl} alt={t.name} />
                      </div>
                      <div className="admin-card-meta">
                        <h4 className="admin-card-title">{t.name || 'Untitled Person'}</h4>
                        <span className="admin-card-role">{t.role || 'No role provided'}</span>
                      </div>
                      <div className="admin-item-actions">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveTestimonial(idx, 'up', 'logic')}
                          className="admin-icon-action-btn"
                          title="Move up"
                        >
                          <Icon icon="mdi:arrow-up" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === content.logicTestimonials.length - 1}
                          onClick={() => handleMoveTestimonial(idx, 'down', 'logic')}
                          className="admin-icon-action-btn"
                          title="Move down"
                        >
                          <Icon icon="mdi:arrow-down" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingTestimonial({ type: 'logic', item: { ...t } })}
                          className="admin-icon-action-btn edit"
                          title="Edit"
                        >
                          <Icon icon="mdi:pencil-outline" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTestimonial(t.id, 'logic')}
                          className="admin-icon-action-btn delete"
                          title="Delete"
                        >
                          <Icon icon="mdi:trash-can-outline" />
                        </button>
                      </div>
                    </div>
                    <p className="admin-card-body-text">{t.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: LOGIC DEVELOPER JOURNEY */}
        {currentTab === 'logic-journey' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <div>
                <h2 className="admin-section-heading">Logic: Developer Journey Timeline</h2>
                <p className="admin-section-subheading">Manage work experience, roles, and accomplishments for the Logic subpage.</p>
              </div>
              <button
                type="button"
                className="admin-primary-btn"
                onClick={() =>
                  setEditingExperience({
                    item: {
                      id: `exp-${Date.now()}`,
                      company: '',
                      role: '',
                      title: '',
                      duration: `${new Date().getFullYear()} - Present`,
                      tech: ['React', 'TypeScript'],
                      accomplishments: ['']
                    },
                    rawTech: 'React, TypeScript'
                  })
                }
              >
                <Icon icon="mdi:plus" />
                <span>Add Experience</span>
              </button>
            </div>

            <div className="admin-cards-list">
              {content.logicExperience.length === 0 ? (
                <div className="admin-empty-state">No experience entries found. Click "Add Experience" to create one.</div>
              ) : (
                content.logicExperience.map((exp, idx) => (
                  <div key={exp.id} className={`admin-card-item${exp.hidden ? ' is-hidden' : ''}`}>
                    <div className="admin-card-header">
                      <div className="admin-card-meta">
                        <div className="admin-meta-tag-row">
                          <span className="admin-pill-tag">{exp.duration}</span>
                          {exp.hidden && (
                            <span className="admin-hidden-badge">
                              <Icon icon="mdi:eye-off-outline" />
                              <span>Hidden from Site</span>
                            </span>
                          )}
                        </div>
                        <h4 className="admin-card-title">
                          {exp.title} <span className="highlight-company">@ {exp.company}</span>
                        </h4>
                        <span className="admin-card-role">{exp.role}</span>
                      </div>
                      <div className="admin-item-actions">
                        <button
                          type="button"
                          onClick={() => handleToggleExperienceVisibility(exp.id)}
                          className={`admin-icon-action-btn ${exp.hidden ? 'hidden-state' : 'visible-state'}`}
                          title={exp.hidden ? "Currently HIDDEN from site. Click to SHOW." : "Currently VISIBLE on site. Click to HIDE."}
                        >
                          <Icon icon={exp.hidden ? "mdi:eye-off-outline" : "mdi:eye-outline"} />
                        </button>
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveExperience(idx, 'up')}
                          className="admin-icon-action-btn"
                          title="Move up"
                        >
                          <Icon icon="mdi:arrow-up" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === content.logicExperience.length - 1}
                          onClick={() => handleMoveExperience(idx, 'down')}
                          className="admin-icon-action-btn"
                          title="Move down"
                        >
                          <Icon icon="mdi:arrow-down" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingExperience({ item: { ...exp }, rawTech: exp.tech.join(', ') })}
                          className="admin-icon-action-btn edit"
                          title="Edit"
                        >
                          <Icon icon="mdi:pencil-outline" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteExperience(exp.id)}
                          className="admin-icon-action-btn delete"
                          title="Delete"
                        >
                          <Icon icon="mdi:trash-can-outline" />
                        </button>
                      </div>
                    </div>

                    <div className="admin-experience-bullets">
                      <strong>Accomplishments ({exp.accomplishments.length}):</strong>
                      <ul>
                        {exp.accomplishments.map((acc, aIdx) => (
                          <li key={aIdx}>{acc}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="admin-tags-row">
                      {exp.tech.map((t, tIdx) => (
                        <span key={tIdx} className="admin-tech-tag">{t}</span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: VIDEO SHOWCASE REELS */}
        {currentTab === 'aesthetics-videos' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <div>
                <h2 className="admin-section-heading">Aesthetics: Video Showcase Reels</h2>
                <p className="admin-section-subheading">
                  Manage featured video editing, motion graphics, and VFX reels shown on the Aesthetics page.
                </p>
              </div>
              <button
                type="button"
                className="admin-primary-btn"
                onClick={() =>
                  setEditingVideoReel({
                    item: {
                      id: `video-${Date.now()}`,
                      title: '',
                      year: `${new Date().getFullYear()}`,
                      duration: '1 MIN 30 SEC',
                      rating: '9.0',
                      role: 'Video Editing',
                      tags: ['Cinematic', 'Motion Graphics'],
                      description: '',
                      thumbnail: '',
                      videoUrl: ''
                    },
                    rawTags: 'Cinematic, Motion Graphics'
                  })
                }
              >
                <Icon icon="mdi:plus" />
                <span>Add Video Reel</span>
              </button>
            </div>

            <div className="admin-cards-list">
              {(!content.videoReels || content.videoReels.length === 0) ? (
                <div className="admin-empty-state">No video reels found. Click "Add Video Reel" to create one.</div>
              ) : (
                content.videoReels.map((reel, idx) => (
                  <div key={reel.id} className="admin-card-item admin-video-card-item">
                    <div className="admin-video-row">
                      <div className="admin-video-thumb-preview">
                        {reel.thumbnail ? (
                          <img src={reel.thumbnail} alt={reel.title} />
                        ) : (
                          <div className="admin-video-thumb-placeholder">
                            <Icon icon="mdi:video-outline" />
                          </div>
                        )}
                        <div className="admin-video-play-badge">
                          <Icon icon="mdi:play" />
                        </div>
                      </div>

                      <div className="admin-video-info-col">
                        <div className="admin-video-top-meta">
                          <span className="admin-pill-tag">{reel.year} &nbsp;•&nbsp; {reel.duration}</span>
                          <span className="admin-video-role-tag">{reel.role}</span>
                        </div>
                        <h4 className="admin-card-title">{reel.title || 'Untitled Video Reel'}</h4>
                        <a
                          href={reel.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="admin-video-url-link"
                          title="Open video URL"
                        >
                          <Icon icon="mdi:link-variant" />
                          <span>{reel.videoUrl || 'No URL specified'}</span>
                        </a>
                        <p className="admin-card-body-text">{reel.description}</p>
                        <div className="admin-tags-row">
                          {reel.tags.map((tag, tIdx) => (
                            <span key={tIdx} className="admin-tech-tag">{tag}</span>
                          ))}
                        </div>
                      </div>

                      <div className="admin-item-actions vertical">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveVideoReel(idx, 'up')}
                          className="admin-icon-action-btn"
                          title="Move up"
                        >
                          <Icon icon="mdi:arrow-up" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === content.videoReels.length - 1}
                          onClick={() => handleMoveVideoReel(idx, 'down')}
                          className="admin-icon-action-btn"
                          title="Move down"
                        >
                          <Icon icon="mdi:arrow-down" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingVideoReel({ item: { ...reel }, rawTags: reel.tags.join(', ') })}
                          className="admin-icon-action-btn edit"
                          title="Edit video reel"
                        >
                          <Icon icon="mdi:pencil-outline" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteVideoReel(reel.id)}
                          className="admin-icon-action-btn delete"
                          title="Delete video reel"
                        >
                          <Icon icon="mdi:trash-can-outline" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: AESTHETICS TESTIMONIALS */}
        {currentTab === 'aesthetics-testimonials' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <div>
                <h2 className="admin-section-heading">Aesthetics &amp; Motion Client Feedback</h2>
                <p className="admin-section-subheading">Manage creative client feedback and reviews on Aesthetics &amp; Motion.</p>
              </div>
              <button
                type="button"
                className="admin-primary-btn"
                onClick={() =>
                  setEditingTestimonial({
                    type: 'aesthetics',
                    item: {
                      id: `aes-test-${Date.now()}`,
                      name: '',
                      role: '',
                      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=A`,
                      text: ''
                    }
                  })
                }
              >
                <Icon icon="mdi:plus" />
                <span>Add Client Feedback</span>
              </button>
            </div>

            <div className="admin-cards-list">
              {content.aestheticsTestimonials.length === 0 ? (
                <div className="admin-empty-state">No feedback entries found. Click "Add Client Feedback" to create one.</div>
              ) : (
                content.aestheticsTestimonials.map((t, idx) => (
                  <div key={t.id} className="admin-card-item">
                    <div className="admin-card-header">
                      <div className="admin-avatar-preview">
                        <img src={t.avatarUrl} alt={t.name} />
                      </div>
                      <div className="admin-card-meta">
                        <h4 className="admin-card-title">{t.name || 'Untitled Person'}</h4>
                        <span className="admin-card-role">{t.role || 'No role provided'}</span>
                      </div>
                      <div className="admin-item-actions">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveTestimonial(idx, 'up', 'aesthetics')}
                          className="admin-icon-action-btn"
                          title="Move up"
                        >
                          <Icon icon="mdi:arrow-up" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === content.aestheticsTestimonials.length - 1}
                          onClick={() => handleMoveTestimonial(idx, 'down', 'aesthetics')}
                          className="admin-icon-action-btn"
                          title="Move down"
                        >
                          <Icon icon="mdi:arrow-down" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingTestimonial({ type: 'aesthetics', item: { ...t } })}
                          className="admin-icon-action-btn edit"
                          title="Edit"
                        >
                          <Icon icon="mdi:pencil-outline" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTestimonial(t.id, 'aesthetics')}
                          className="admin-icon-action-btn delete"
                          title="Delete"
                        >
                          <Icon icon="mdi:trash-can-outline" />
                        </button>
                      </div>
                    </div>
                    <p className="admin-card-body-text">{t.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 5: AESTHETICS CREATIVE JOURNEY */}
        {currentTab === 'aesthetics-journey' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <div>
                <h2 className="admin-section-heading">Aesthetics: Creative Journey Timeline</h2>
                <p className="admin-section-subheading">Manage milestones for video editing, graphics, and visual creative roles.</p>
              </div>
              <button
                type="button"
                className="admin-primary-btn"
                onClick={() =>
                  setEditingAestheticsExperience({
                    item: {
                      id: `aes-exp-${Date.now()}`,
                      company: '',
                      role: '',
                      title: '',
                      duration: `${new Date().getFullYear()} - Present`,
                      accomplishments: ['']
                    }
                  })
                }
              >
                <Icon icon="mdi:plus" />
                <span>Add Creative Experience</span>
              </button>
            </div>

            <div className="admin-cards-list">
              {content.aestheticsExperience.length === 0 ? (
                <div className="admin-empty-state">No creative milestones found. Click "Add Creative Experience" to create one.</div>
              ) : (
                content.aestheticsExperience.map((exp, idx) => (
                  <div key={exp.id} className={`admin-card-item${exp.hidden ? ' is-hidden' : ''}`}>
                    <div className="admin-card-header">
                      <div className="admin-card-meta">
                        <div className="admin-meta-tag-row">
                          <span className="admin-pill-tag">{exp.duration}</span>
                          {exp.hidden && (
                            <span className="admin-hidden-badge">
                              <Icon icon="mdi:eye-off-outline" />
                              <span>Hidden from Site</span>
                            </span>
                          )}
                        </div>
                        <h4 className="admin-card-title">
                          {exp.title} <span className="highlight-company">@ {exp.company}</span>
                        </h4>
                        <span className="admin-card-role">{exp.role}</span>
                      </div>
                      <div className="admin-item-actions">
                        <button
                          type="button"
                          onClick={() => handleToggleAestheticsExperienceVisibility(exp.id)}
                          className={`admin-icon-action-btn ${exp.hidden ? 'hidden-state' : 'visible-state'}`}
                          title={exp.hidden ? "Currently HIDDEN from site. Click to SHOW." : "Currently VISIBLE on site. Click to HIDE."}
                        >
                          <Icon icon={exp.hidden ? "mdi:eye-off-outline" : "mdi:eye-outline"} />
                        </button>
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveAestheticsExperience(idx, 'up')}
                          className="admin-icon-action-btn"
                          title="Move up"
                        >
                          <Icon icon="mdi:arrow-up" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === content.aestheticsExperience.length - 1}
                          onClick={() => handleMoveAestheticsExperience(idx, 'down')}
                          className="admin-icon-action-btn"
                          title="Move down"
                        >
                          <Icon icon="mdi:arrow-down" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingAestheticsExperience({ item: { ...exp } })}
                          className="admin-icon-action-btn edit"
                          title="Edit"
                        >
                          <Icon icon="mdi:pencil-outline" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAestheticsExperience(exp.id)}
                          className="admin-icon-action-btn delete"
                          title="Delete"
                        >
                          <Icon icon="mdi:trash-can-outline" />
                        </button>
                      </div>
                    </div>

                    <div className="admin-experience-bullets">
                      <strong>Accomplishments ({exp.accomplishments.length}):</strong>
                      <ul>
                        {exp.accomplishments.map((acc, aIdx) => (
                          <li key={aIdx}>{acc}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 6: SETTINGS & SUPABASE */}
        {currentTab === 'settings' && (
          <div className="admin-section settings-section">
            <h2 className="admin-section-heading">Settings &amp; Cloud Database</h2>
            <p className="admin-section-subheading">Manage your Supabase cloud synchronization, backup and restore data.</p>

            <div className="admin-settings-grid">
              {/* Supabase Cloud Setup Card */}
              <div className="admin-settings-card full-width">
                <h3 className="settings-card-title">
                  <Icon icon={isCloudActive ? 'mdi:cloud-check' : 'mdi:cloud-upload-outline'} />
                  <span>Supabase Cloud Integration</span>
                  {isCloudActive ? (
                    <span className="admin-status-pill success">Connected &amp; Live Sync Active</span>
                  ) : (
                    <span className="admin-status-pill warning">Not Connected</span>
                  )}
                </h3>
                
                <p className="settings-card-desc">
                  When connected to Supabase, any edits you make in the Admin Panel (from your laptop or mobile) are saved to a secure PostgreSQL database and <strong>immediately update the site for all visitors worldwide</strong>.
                </p>

                <div className="admin-supabase-guide">
                  <h4 className="supabase-guide-title">
                    <Icon icon="mdi:numeric-1-circle" />
                    <span>Quick 60-Second Setup:</span>
                  </h4>
                  <ol className="supabase-steps-list">
                    <li>Create a free project at <a href="https://supabase.com" target="_blank" rel="noreferrer">supabase.com</a>.</li>
                    <li>Go to <strong>SQL Editor</strong> in your Supabase dashboard and run this script:</li>
                  </ol>

                  <div className="admin-sql-block">
                    <div className="admin-sql-header">
                      <span>SQL Setup Script</span>
                      <button type="button" onClick={copySqlSnippet} className="admin-sql-copy-btn">
                        <Icon icon={copiedSql ? 'mdi:check' : 'mdi:content-copy'} />
                        <span>{copiedSql ? 'Copied!' : 'Copy SQL'}</span>
                      </button>
                    </div>
                    <pre className="admin-sql-code">{sqlSchemaSnippet}</pre>
                  </div>

                  <ol start={3} className="supabase-steps-list">
                    <li>Add your project credentials to <code>.env.local</code> (or GitHub Secrets for production):</li>
                  </ol>
                  <pre className="admin-env-snippet">
{`VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key`}
                  </pre>
                </div>
              </div>

              {/* Export & Import */}
              <div className="admin-settings-card">
                <h3 className="settings-card-title">
                  <Icon icon="mdi:cloud-sync-outline" />
                  <span>Export &amp; Import Backup</span>
                </h3>
                <p className="settings-card-desc">
                  Download a complete JSON backup of your testimonials, journeys, and video reels.
                </p>
                <div className="settings-actions-row">
                  <button type="button" onClick={handleExport} className="admin-secondary-btn">
                    <Icon icon="mdi:download-outline" />
                    <span>Download JSON Backup</span>
                  </button>
                </div>

                <div className="import-box-wrap">
                  <label>Restore from JSON String:</label>
                  <textarea
                    rows={3}
                    className="admin-textarea"
                    placeholder="Paste exported JSON here..."
                    value={importJsonText}
                    onChange={(e) => setImportJsonText(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleImport}
                    disabled={!importJsonText.trim()}
                    className="admin-primary-btn"
                  >
                    <Icon icon="mdi:upload-outline" />
                    <span>Import JSON</span>
                  </button>
                </div>
              </div>

              {/* Reset to Factory Defaults */}
              <div className="admin-settings-card danger-zone">
                <h3 className="settings-card-title danger">
                  <Icon icon="mdi:alert-octagon-outline" />
                  <span>Reset All Data</span>
                </h3>
                <p className="settings-card-desc">
                  Restores all testimonials, journey entries, and video reels back to the original built-in project defaults.
                </p>
                <button type="button" onClick={handleResetToDefaults} className="admin-danger-btn">
                  <Icon icon="mdi:refresh" />
                  <span>Reset to Factory Defaults</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* --- EDIT TESTIMONIAL MODAL --- */}
      {editingTestimonial && editingTestimonial.item && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-box">
            <div className="admin-modal-header">
              <h3>
                {editingTestimonial.item.name ? 'Edit Testimonial' : 'New Testimonial'}{' '}
                <small>({editingTestimonial.type === 'logic' ? 'Logic & Systems' : 'Aesthetics'})</small>
              </h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setEditingTestimonial(null)}
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingTestimonial.item) {
                  handleSaveTestimonial(editingTestimonial.item, editingTestimonial.type);
                }
              }}
              className="admin-modal-form"
            >
              <div className="admin-form-group">
                <label>Person Name *</label>
                <input
                  type="text"
                  required
                  className="admin-input"
                  placeholder="e.g. Thavinya Wijesinghe"
                  value={editingTestimonial.item.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    const seed = val.trim() ? encodeURIComponent(val.trim()) : 'User';
                    setEditingTestimonial({
                      ...editingTestimonial,
                      item: {
                        ...editingTestimonial.item!,
                        name: val,
                        avatarUrl: editingTestimonial.item!.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${seed}`
                      }
                    });
                  }}
                />
              </div>

              <div className="admin-form-group">
                <label>Role &amp; Company *</label>
                <input
                  type="text"
                  required
                  className="admin-input"
                  placeholder="e.g. Senior Business Analyst @ LOLC Technologies"
                  value={editingTestimonial.item.role}
                  onChange={(e) =>
                    setEditingTestimonial({
                      ...editingTestimonial,
                      item: { ...editingTestimonial.item!, role: e.target.value }
                    })
                  }
                />
              </div>

              <div className="admin-form-group">
                <label>Avatar Photo / Icon URL</label>
                <div className="admin-input-btn-group">
                  <input
                    type="url"
                    className="admin-input"
                    placeholder="https://api.dicebear.com/7.x/initials/svg?seed=..."
                    value={editingTestimonial.item.avatarUrl}
                    onChange={(e) =>
                      setEditingTestimonial({
                        ...editingTestimonial,
                        item: { ...editingTestimonial.item!, avatarUrl: e.target.value }
                      })
                    }
                  />
                  <button
                    type="button"
                    className="admin-secondary-btn small"
                    onClick={() => {
                      const seed = editingTestimonial.item?.name.trim() || 'User';
                      setEditingTestimonial({
                        ...editingTestimonial,
                        item: {
                          ...editingTestimonial.item!,
                          avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed)}`
                        }
                      });
                    }}
                  >
                    DiceBear
                  </button>
                </div>
              </div>

              <div className="admin-form-group">
                <label>Testimonial Text *</label>
                <textarea
                  rows={6}
                  required
                  className="admin-textarea"
                  placeholder="Paste or write the full testimonial feedback..."
                  value={editingTestimonial.item.text}
                  onChange={(e) =>
                    setEditingTestimonial({
                      ...editingTestimonial,
                      item: { ...editingTestimonial.item!, text: e.target.value }
                    })
                  }
                />
              </div>

              <div className="admin-modal-actions">
                <button type="button" onClick={() => setEditingTestimonial(null)} className="admin-secondary-btn">
                  Cancel
                </button>
                <button type="submit" className="admin-primary-btn">
                  Save Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT LOGIC EXPERIENCE MODAL --- */}
      {editingExperience && editingExperience.item && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-box">
            <div className="admin-modal-header">
              <h3>
                {editingExperience.item.title ? 'Edit Developer Experience' : 'New Developer Experience'}
              </h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setEditingExperience(null)}
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingExperience.item) {
                  const finalTech = editingExperience.rawTech
                    .split(',')
                    .map((t) => t.trim())
                    .filter(Boolean);
                  handleSaveExperience({
                    ...editingExperience.item,
                    tech: finalTech
                  });
                }
              }}
              className="admin-modal-form"
            >
              <div className="admin-form-row">
                <div className="admin-form-group flex-1">
                  <label>Job Title *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    placeholder="e.g. Associate Software Engineer"
                    value={editingExperience.item.title}
                    onChange={(e) =>
                      setEditingExperience({
                        ...editingExperience,
                        item: { ...editingExperience.item!, title: e.target.value }
                      })
                    }
                  />
                </div>
                <div className="admin-form-group flex-1">
                  <label>Company *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    placeholder="e.g. LOLC Technologies"
                    value={editingExperience.item.company}
                    onChange={(e) =>
                      setEditingExperience({
                        ...editingExperience,
                        item: { ...editingExperience.item!, company: e.target.value }
                      })
                    }
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group flex-1">
                  <label>Role / Team Description *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    placeholder="e.g. Fusion X Team - Frontend Developer"
                    value={editingExperience.item.role}
                    onChange={(e) =>
                      setEditingExperience({
                        ...editingExperience,
                        item: { ...editingExperience.item!, role: e.target.value }
                      })
                    }
                  />
                </div>
                <div className="admin-form-group flex-1">
                  <label>Duration *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    placeholder="e.g. 2024 - Present"
                    value={editingExperience.item.duration}
                    onChange={(e) =>
                      setEditingExperience({
                        ...editingExperience,
                        item: { ...editingExperience.item!, duration: e.target.value }
                      })
                    }
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Tech Stack (Comma-separated)</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="React, TypeScript, Redux, Spring Boot, Git"
                  value={editingExperience.rawTech}
                  onChange={(e) =>
                    setEditingExperience({
                      ...editingExperience,
                      rawTech: e.target.value
                    })
                  }
                />
              </div>

              <div className="admin-form-group">
                <div className="admin-field-header-row">
                  <label>Accomplishments / Key Responsibilities</label>
                  <span className="admin-field-hint">Add bullet points individually or click "+ Add Bullet Point"</span>
                </div>

                <div className="admin-bullets-builder">
                  {editingExperience.item.accomplishments.map((acc, accIdx) => (
                    <div key={accIdx} className="admin-bullet-input-row">
                      <span className="admin-bullet-marker">•</span>
                      <input
                        type="text"
                        className="admin-input flex-1"
                        placeholder={`Accomplishment bullet #${accIdx + 1}`}
                        value={acc}
                        onChange={(e) => {
                          const updated = [...editingExperience.item!.accomplishments];
                          updated[accIdx] = e.target.value;
                          setEditingExperience({
                            ...editingExperience,
                            item: { ...editingExperience.item!, accomplishments: updated }
                          });
                        }}
                      />
                      <button
                        type="button"
                        className="admin-icon-action-btn delete"
                        onClick={() => {
                          const updated = editingExperience.item!.accomplishments.filter((_, i) => i !== accIdx);
                          setEditingExperience({
                            ...editingExperience,
                            item: {
                              ...editingExperience.item!,
                              accomplishments: updated.length ? updated : ['']
                            }
                          });
                        }}
                        title="Delete bullet"
                      >
                        <Icon icon="mdi:close" />
                      </button>
                    </div>
                  ))}

                  <div className="admin-bullet-builder-actions">
                    <button
                      type="button"
                      className="admin-secondary-btn small"
                      onClick={() => {
                        setEditingExperience({
                          ...editingExperience,
                          item: {
                            ...editingExperience.item!,
                            accomplishments: [...editingExperience.item!.accomplishments, '']
                          }
                        });
                      }}
                    >
                      <Icon icon="mdi:plus" />
                      <span>Add Bullet Point</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-checkbox-container">
                  <input
                    type="checkbox"
                    checked={!editingExperience.item.hidden}
                    onChange={(e) =>
                      setEditingExperience({
                        ...editingExperience,
                        item: { ...editingExperience.item!, hidden: !e.target.checked }
                      })
                    }
                  />
                  <span>Visible on Public Portfolio Website</span>
                </label>
              </div>

              <div className="admin-modal-actions">
                <button type="button" onClick={() => setEditingExperience(null)} className="admin-secondary-btn">
                  Cancel
                </button>
                <button type="submit" className="admin-primary-btn">
                  Save Experience
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT VIDEO REEL MODAL --- */}
      {editingVideoReel && editingVideoReel.item && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-box">
            <div className="admin-modal-header">
              <h3>
                {editingVideoReel.item.title ? 'Edit Video Reel' : 'New Video Reel'}
              </h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setEditingVideoReel(null)}
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingVideoReel.item) {
                  const finalTags = editingVideoReel.rawTags
                    .split(',')
                    .map((t) => t.trim())
                    .filter(Boolean);
                  handleSaveVideoReel({
                    ...editingVideoReel.item,
                    tags: finalTags
                  });
                }
              }}
              className="admin-modal-form"
            >
              <div className="admin-form-group">
                <label>Video URL * (YouTube link or Direct Video URL)</label>
                <input
                  type="url"
                  required
                  className="admin-input"
                  placeholder="https://youtu.be/..."
                  value={editingVideoReel.item.videoUrl}
                  onChange={(e) => {
                    const url = e.target.value;
                    const autoThumb = extractYouTubeThumbnail(url);
                    setEditingVideoReel({
                      ...editingVideoReel,
                      item: {
                        ...editingVideoReel.item!,
                        videoUrl: url,
                        thumbnail: (!editingVideoReel.item!.thumbnail || editingVideoReel.item!.thumbnail.includes('img.youtube.com') || editingVideoReel.item!.thumbnail.includes('i.ytimg.com')) && autoThumb
                          ? autoThumb
                          : editingVideoReel.item!.thumbnail
                      }
                    });
                  }}
                />
              </div>

              <div className="admin-form-group">
                <label>Thumbnail Image URL *</label>
                <div className="admin-input-btn-group">
                  <input
                    type="url"
                    required
                    className="admin-input"
                    placeholder="https://i.ytimg.com/vi/.../maxresdefault.jpg or image URL"
                    value={editingVideoReel.item.thumbnail}
                    onChange={(e) =>
                      setEditingVideoReel({
                        ...editingVideoReel,
                        item: { ...editingVideoReel.item!, thumbnail: e.target.value }
                      })
                    }
                  />
                  <button
                    type="button"
                    className="admin-secondary-btn small"
                    onClick={async () => {
                      const autoThumb = await getBestYouTubeThumbnail(editingVideoReel.item?.videoUrl || '');
                      if (autoThumb) {
                        setEditingVideoReel({
                          ...editingVideoReel,
                          item: { ...editingVideoReel.item!, thumbnail: autoThumb }
                        });
                      } else {
                        alert('Could not auto-detect a YouTube ID from the Video URL. Please paste the thumbnail link directly.');
                      }
                    }}
                  >
                    Auto-Fetch YouTube Thumb
                  </button>
                </div>
                {editingVideoReel.item.thumbnail && (
                  <div className="admin-thumb-preview-wrap">
                    <img
                      src={editingVideoReel.item.thumbnail}
                      alt="Thumbnail preview"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src.includes('maxresdefault.jpg')) {
                          target.src = target.src.replace('maxresdefault.jpg', 'sddefault.jpg');
                        } else if (target.src.includes('sddefault.jpg')) {
                          target.src = target.src.replace('sddefault.jpg', 'hqdefault.jpg');
                        } else if (target.src.includes('hqdefault.jpg')) {
                          target.src = target.src.replace('hqdefault.jpg', 'mqdefault.jpg');
                        }
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group flex-1">
                  <label>Video Title *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    placeholder="e.g. Adsync Pitch Video"
                    value={editingVideoReel.item.title}
                    onChange={(e) =>
                      setEditingVideoReel({
                        ...editingVideoReel,
                        item: { ...editingVideoReel.item!, title: e.target.value }
                      })
                    }
                  />
                </div>
                <div className="admin-form-group flex-1">
                  <label>Role / Category *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    placeholder="e.g. Marketing Promo / Pitch, Teaser Video"
                    value={editingVideoReel.item.role}
                    onChange={(e) =>
                      setEditingVideoReel({
                        ...editingVideoReel,
                        item: { ...editingVideoReel.item!, role: e.target.value }
                      })
                    }
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group flex-1">
                  <label>Year *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    placeholder="e.g. 2025"
                    value={editingVideoReel.item.year}
                    onChange={(e) =>
                      setEditingVideoReel({
                        ...editingVideoReel,
                        item: { ...editingVideoReel.item!, year: e.target.value }
                      })
                    }
                  />
                </div>
                <div className="admin-form-group flex-1">
                  <label>Duration *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    placeholder="e.g. 2 MIN 06 SEC"
                    value={editingVideoReel.item.duration}
                    onChange={(e) =>
                      setEditingVideoReel({
                        ...editingVideoReel,
                        item: { ...editingVideoReel.item!, duration: e.target.value }
                      })
                    }
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Tags (Comma-separated)</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Promo, Marketing, Pitch, VFX"
                  value={editingVideoReel.rawTags}
                  onChange={(e) =>
                    setEditingVideoReel({
                      ...editingVideoReel,
                      rawTags: e.target.value
                    })
                  }
                />
              </div>

              <div className="admin-form-group">
                <label>Description *</label>
                <textarea
                  rows={4}
                  required
                  className="admin-textarea"
                  placeholder="Explain the video concept, storytelling techniques, motion design, tools used, etc..."
                  value={editingVideoReel.item.description}
                  onChange={(e) =>
                    setEditingVideoReel({
                      ...editingVideoReel,
                      item: { ...editingVideoReel.item!, description: e.target.value }
                    })
                  }
                />
              </div>

              <div className="admin-modal-actions">
                <button
                  type="button"
                  onClick={() => setEditingVideoReel(null)}
                  className="admin-secondary-btn"
                >
                  Cancel
                </button>
                <button type="submit" className="admin-primary-btn">
                  Save Video Reel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT AESTHETICS EXPERIENCE MODAL --- */}
      {editingAestheticsExperience && editingAestheticsExperience.item && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-box">
            <div className="admin-modal-header">
              <h3>
                {editingAestheticsExperience.item.title ? 'Edit Creative Experience' : 'New Creative Experience'}
              </h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setEditingAestheticsExperience(null)}
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingAestheticsExperience.item) {
                  handleSaveAestheticsExperience(editingAestheticsExperience.item);
                }
              }}
              className="admin-modal-form"
            >
              <div className="admin-form-row">
                <div className="admin-form-group flex-1">
                  <label>Title / Role Name *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    placeholder="e.g. Video Editor / Graphic Designer"
                    value={editingAestheticsExperience.item.title}
                    onChange={(e) =>
                      setEditingAestheticsExperience({
                        item: { ...editingAestheticsExperience.item!, title: e.target.value }
                      })
                    }
                  />
                </div>
                <div className="admin-form-group flex-1">
                  <label>Company / Organization *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    placeholder="e.g. Sentered Media"
                    value={editingAestheticsExperience.item.company}
                    onChange={(e) =>
                      setEditingAestheticsExperience({
                        item: { ...editingAestheticsExperience.item!, company: e.target.value }
                      })
                    }
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group flex-1">
                  <label>Role Meta / Details *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    placeholder="e.g. Video Production / Level 2 Seller"
                    value={editingAestheticsExperience.item.role}
                    onChange={(e) =>
                      setEditingAestheticsExperience({
                        item: { ...editingAestheticsExperience.item!, role: e.target.value }
                      })
                    }
                  />
                </div>
                <div className="admin-form-group flex-1">
                  <label>Duration *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    placeholder="e.g. 2023 - 2025"
                    value={editingAestheticsExperience.item.duration}
                    onChange={(e) =>
                      setEditingAestheticsExperience({
                        item: { ...editingAestheticsExperience.item!, duration: e.target.value }
                      })
                    }
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <div className="admin-field-header-row">
                  <label>Key Accomplishments / Responsibilities</label>
                  <span className="admin-field-hint">Add bullet points individually or click "+ Add Bullet Point"</span>
                </div>

                <div className="admin-bullets-builder">
                  {editingAestheticsExperience.item.accomplishments.map((acc, accIdx) => (
                    <div key={accIdx} className="admin-bullet-input-row">
                      <span className="admin-bullet-marker">•</span>
                      <input
                        type="text"
                        className="admin-input flex-1"
                        placeholder={`Accomplishment bullet #${accIdx + 1}`}
                        value={acc}
                        onChange={(e) => {
                          const updated = [...editingAestheticsExperience.item!.accomplishments];
                          updated[accIdx] = e.target.value;
                          setEditingAestheticsExperience({
                            item: { ...editingAestheticsExperience.item!, accomplishments: updated }
                          });
                        }}
                      />
                      <button
                        type="button"
                        className="admin-icon-action-btn delete"
                        onClick={() => {
                          const updated = editingAestheticsExperience.item!.accomplishments.filter((_, i) => i !== accIdx);
                          setEditingAestheticsExperience({
                            item: {
                              ...editingAestheticsExperience.item!,
                              accomplishments: updated.length ? updated : ['']
                            }
                          });
                        }}
                        title="Delete bullet"
                      >
                        <Icon icon="mdi:close" />
                      </button>
                    </div>
                  ))}

                  <div className="admin-bullet-builder-actions">
                    <button
                      type="button"
                      className="admin-secondary-btn small"
                      onClick={() => {
                        setEditingAestheticsExperience({
                          item: {
                            ...editingAestheticsExperience.item!,
                            accomplishments: [...editingAestheticsExperience.item!.accomplishments, '']
                          }
                        });
                      }}
                    >
                      <Icon icon="mdi:plus" />
                      <span>Add Bullet Point</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-checkbox-container">
                  <input
                    type="checkbox"
                    checked={!editingAestheticsExperience.item.hidden}
                    onChange={(e) =>
                      setEditingAestheticsExperience({
                        item: { ...editingAestheticsExperience.item!, hidden: !e.target.checked }
                      })
                    }
                  />
                  <span>Visible on Public Portfolio Website</span>
                </label>
              </div>

              <div className="admin-modal-actions">
                <button
                  type="button"
                  onClick={() => setEditingAestheticsExperience(null)}
                  className="admin-secondary-btn"
                >
                  Cancel
                </button>
                <button type="submit" className="admin-primary-btn">
                  Save Creative Experience
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
