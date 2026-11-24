import './maintenance-view.css';

export default function MaintenanceView() {
  return (
    <section
      className="maintenance-stage"
      role="status"
      aria-live="polite"
      aria-label="Site under maintenance"
    >
      {/* Subtle ambient theme grid */}
      <div className="maint-bg-grid" aria-hidden="true" />

      <div className="maint-container">
        {/* Top Editorial Bar (3 dots + status code) */}
        <header className="maint-topbar">
          <div className="maint-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <span className="maint-code">STATUS 503</span>
        </header>

        {/* Main Editorial Copy */}
        <div className="maint-copy">
          <span className="maint-kicker">UNDER REPAIR / SYSTEM BUILD</span>
          <h1 className="maint-headline">In Repair.</h1>
          <div className="maint-rule" aria-hidden="true" />
          <p className="maint-message">
            Currently tuning and deploying updates to pramuditha.dev.
            <br />
            Everything will be back online shortly.
          </p>
          <p className="maint-attrib">
            <span className="attrib-dim">Portfolio</span>{' '}
            <strong className="attrib-bold">Pramuditha Nadun</strong>
          </p>
        </div>

        {/* Suspended Traffic Signal with Red Heart Light */}
        <div className="signal-rig" aria-hidden="true">
          {/* Diagonal Suspension Guy-Wires */}
          <svg
            className="signal-wires"
            viewBox="0 0 800 160"
            preserveAspectRatio="none"
            fill="none"
          >
            <line x1="0" y1="22" x2="225" y2="118" className="wire-line" />
            <line x1="485" y1="118" x2="660" y2="62" className="wire-line" />
            <line x1="0" y1="112" x2="48" y2="122" className="wire-line" />
          </svg>

          {/* Horizontal Mast & Signal Housings */}
          <div className="signal-mast-row">
            <div className="mast-pipe">
              <span className="mast-clamp" />
            </div>

            <div className="signal-cluster">
              {/* Left Hood (Off) */}
              <div className="signal-pod">
                <div className="signal-hood">
                  <div className="signal-lens is-off" />
                </div>
              </div>

              {/* Center Hood (Off) */}
              <div className="signal-pod">
                <div className="signal-hood">
                  <div className="signal-lens is-off" />
                </div>
              </div>

              {/* Right Hood (Illuminated Red Heart) */}
              <div className="signal-pod is-lit">
                <div className="signal-hood">
                  <div className="signal-lens is-red-heart">
                    <svg className="heart-svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
