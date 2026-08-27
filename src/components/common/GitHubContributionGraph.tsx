import { useState, useEffect, useMemo } from 'react';
import { Icon } from '@iconify/react';
import type { ThemeMode } from '../../types';
import { EXTERNAL_LINKS } from '../../constants/links';

interface ContributionDay {
  date: string;
  count: number;
  level: number; // 0, 1, 2, 3, 4
}

interface ApiResponse {
  total: Record<string, number>;
  contributions: ContributionDay[];
}

interface GitHubContributionGraphProps {
  theme: ThemeMode;
  username?: string;
}

const CELL_SIZE = 10;
const CELL_GAP = 3;
const PITCH = CELL_SIZE + CELL_GAP; // 13px
const OFFSET_X = 26;
const OFFSET_Y = 16;

export default function GitHubContributionGraph({
  theme,
  username = 'PramudithaN'
}: GitHubContributionGraphProps) {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>('last');
  const [hoveredDay, setHoveredDay] = useState<{
    day: ContributionDay;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;
    const cacheKey = `gh_contributions_${username}`;

    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        setData(parsed);
        setLoading(false);
      }
    } catch {
      // Ignore cache errors
    }

    async function fetchContributions() {
      try {
        const response = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${username}?y=all`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch data (${response.status})`);
        }
        const json: ApiResponse = await response.json();
        if (isMounted) {
          setData(json);
          setLoading(false);
          try {
            sessionStorage.setItem(cacheKey, JSON.stringify(json));
          } catch {
            // Ignore storage quota
          }
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Error fetching contributions');
          setLoading(false);
        }
      }
    }

    fetchContributions();

    return () => {
      isMounted = false;
    };
  }, [username]);

  // Dismiss tooltip on outside touch
  useEffect(() => {
    if (!hoveredDay) return;

    const handleTouchOutside = () => {
      setHoveredDay(null);
    };

    window.addEventListener('scroll', handleTouchOutside, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleTouchOutside);
    };
  }, [hoveredDay]);

  // Available years sorted descending
  const availableYears = useMemo(() => {
    if (!data?.total) return [];
    const years = Object.keys(data.total).filter((y) => y !== 'lastYear');
    years.sort((a, b) => Number(b) - Number(a));
    return years;
  }, [data]);

  // Set default selected year once data loads
  useEffect(() => {
    if (availableYears.length > 0 && selectedYear === 'last') {
      const currentYear = new Date().getFullYear().toString();
      if (availableYears.includes(currentYear)) {
        setSelectedYear(currentYear);
      } else {
        setSelectedYear(availableYears[0]);
      }
    }
  }, [availableYears, selectedYear]);

  // Filter contributions by selected year
  const filteredDays = useMemo(() => {
    if (!data?.contributions) return [];

    if (selectedYear === 'last') {
      return data.contributions.slice(-371);
    }

    return data.contributions.filter((item) => item.date.startsWith(selectedYear));
  }, [data, selectedYear]);

  // Calculate total count for the selected year
  const totalContributions = useMemo(() => {
    if (!data) return 0;
    if (selectedYear !== 'last' && data.total[selectedYear] !== undefined) {
      return data.total[selectedYear];
    }
    return filteredDays.reduce((acc, curr) => acc + curr.count, 0);
  }, [data, selectedYear, filteredDays]);

  // Group days into columns (weeks)
  const { weeks, monthLabels, svgWidth, svgHeight } = useMemo(() => {
    if (filteredDays.length === 0) {
      return { weeks: [], monthLabels: [], svgWidth: 720, svgHeight: 112 };
    }

    const weeksList: (ContributionDay | null)[][] = [];
    let currentWeek: (ContributionDay | null)[] = [];

    const firstDate = new Date(filteredDays[0].date + 'T00:00:00');
    const firstDayOfWeek = firstDate.getDay(); // 0 is Sunday

    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null);
    }

    filteredDays.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeksList.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeksList.push(currentWeek);
    }

    // Determine Month Labels
    const months: { label: string; colIndex: number }[] = [];
    let lastMonth = -1;

    weeksList.forEach((week, colIdx) => {
      const firstValidDay = week.find((d) => d !== null);
      if (firstValidDay) {
        const d = new Date(firstValidDay.date + 'T00:00:00');
        const month = d.getMonth();
        if (month !== lastMonth) {
          const monthName = d.toLocaleString('en-US', { month: 'short' });
          months.push({ label: monthName, colIndex: colIdx });
          lastMonth = month;
        }
      }
    });

    const calculatedWidth = OFFSET_X + weeksList.length * PITCH + 4;
    const calculatedHeight = OFFSET_Y + 7 * PITCH + 2;

    return {
      weeks: weeksList,
      monthLabels: months,
      svgWidth: calculatedWidth,
      svgHeight: calculatedHeight
    };
  }, [filteredDays]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleCellInteraction = (
    day: ContributionDay,
    e: React.MouseEvent<SVGRectElement> | React.TouchEvent<SVGRectElement>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredDay({
      day,
      x: rect.left + rect.width / 2,
      y: rect.top
    });
  };

  return (
    <div className={`gh-graph-card ${theme}-theme`}>
      {/* Card Header */}
      <div className="gh-graph-header">
        <div className="gh-graph-title-group">
          <div className="gh-graph-badge">
            <Icon icon="mdi:github" className="gh-badge-icon" />
            <span>GitHub Activity</span>
          </div>
          <h3 className="gh-graph-count">
            {loading ? (
              <span className="gh-count-skeleton">Fetching activity...</span>
            ) : (
              <>
                <span className="gh-count-number">{totalContributions.toLocaleString()}</span>{' '}
                contributions in {selectedYear === 'last' ? 'past year' : selectedYear}
              </>
            )}
          </h3>
        </div>

        {/* Year Selector (Pills on desktop, dropdown on mobile) */}
        <div className="gh-graph-year-select-wrap">
          <div className="gh-year-pills hide-on-mobile">
            {availableYears.slice(0, 5).map((yr) => (
              <button
                key={yr}
                type="button"
                className={`gh-year-pill ${selectedYear === yr ? 'active' : ''}`}
                onClick={() => setSelectedYear(yr)}
              >
                {yr}
              </button>
            ))}
          </div>

          <div className="gh-year-dropdown-wrap">
            <select
              className="gh-year-dropdown"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              aria-label="Select contribution year"
            >
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Heatmap Container - Scalable SVG to fit 100% without horizontal scroll */}
      <div className="gh-heatmap-outer">
        {loading ? (
          <div className="gh-graph-loading">
            <div className="gh-loading-skeleton-grid" />
            <span>Loading contributions from GitHub...</span>
          </div>
        ) : error && weeks.length === 0 ? (
          <div className="gh-graph-error">
            <Icon icon="mdi:alert-circle-outline" className="gh-error-icon" />
            <span>Unable to load GitHub contributions right now.</span>
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="gh-error-link"
            >
              View on GitHub ↗
            </a>
          </div>
        ) : (
          <div className="gh-svg-wrapper">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="gh-heatmap-svg"
              role="img"
              aria-label={`GitHub contribution heatmap for ${username}`}
            >
              {/* Month Labels */}
              {monthLabels.map((m, idx) => (
                <text
                  key={idx}
                  x={OFFSET_X + m.colIndex * PITCH}
                  y={10}
                  className="gh-svg-text gh-svg-month-label"
                >
                  {m.label}
                </text>
              ))}

              {/* Day Labels (Mon, Wed, Fri) */}
              <text x={0} y={OFFSET_Y + 1 * PITCH + 8} className="gh-svg-text gh-svg-day-label">
                Mon
              </text>
              <text x={0} y={OFFSET_Y + 3 * PITCH + 8} className="gh-svg-text gh-svg-day-label">
                Wed
              </text>
              <text x={0} y={OFFSET_Y + 5 * PITCH + 8} className="gh-svg-text gh-svg-day-label">
                Fri
              </text>

              {/* Grid Cells */}
              {weeks.map((week, weekIdx) => {
                const x = OFFSET_X + weekIdx * PITCH;
                return (
                  <g key={weekIdx}>
                    {week.map((day, dayIdx) => {
                      if (!day) return null;
                      const y = OFFSET_Y + dayIdx * PITCH;
                      const isHovered = hoveredDay?.day.date === day.date;

                      return (
                        <rect
                          key={day.date}
                          x={x}
                          y={y}
                          width={CELL_SIZE}
                          height={CELL_SIZE}
                          rx={2.2}
                          ry={2.2}
                          className={`gh-day-cell level-${day.level} ${isHovered ? 'hovered' : ''}`}
                          onMouseEnter={(e) => handleCellInteraction(day, e)}
                          onMouseLeave={() => setHoveredDay(null)}
                          onTouchStart={(e) => handleCellInteraction(day, e)}
                          tabIndex={0}
                          role="gridcell"
                          aria-label={`${day.count} contributions on ${day.date}`}
                        />
                      );
                    })}
                  </g>
                );
              })}
            </svg>
          </div>
        )}
      </div>

      {/* Floating Tooltip */}
      {hoveredDay && (
        <div
          className="gh-tooltip"
          style={{
            position: 'fixed',
            left: `${hoveredDay.x}px`,
            top: `${hoveredDay.y - 8}px`,
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'none',
            zIndex: 9999
          }}
        >
          <div className="gh-tooltip-content">
            <strong>
              {hoveredDay.day.count === 0
                ? 'No contributions'
                : `${hoveredDay.day.count} contribution${hoveredDay.day.count > 1 ? 's' : ''}`}
            </strong>{' '}
            on {formatDate(hoveredDay.day.date)}
          </div>
          <div className="gh-tooltip-arrow" />
        </div>
      )}

      {/* Footer / Legend */}
      <div className="gh-graph-footer">
        <a
          href={EXTERNAL_LINKS.GITHUB}
          target="_blank"
          rel="noopener noreferrer"
          className="gh-footer-guide-link"
        >
          <span>View profile @{username}</span>
          <span className="gh-arrow">↗</span>
        </a>

        <div className="gh-legend">
          <span className="gh-legend-label">Less</span>
          <div className="gh-legend-cells">
            <svg width="68" height="12" viewBox="0 0 68 12" className="gh-legend-svg">
              <rect x="0" y="1" width="10" height="10" rx="2" className="gh-day-cell level-0" />
              <rect x="14" y="1" width="10" height="10" rx="2" className="gh-day-cell level-1" />
              <rect x="28" y="1" width="10" height="10" rx="2" className="gh-day-cell level-2" />
              <rect x="42" y="1" width="10" height="10" rx="2" className="gh-day-cell level-3" />
              <rect x="56" y="1" width="10" height="10" rx="2" className="gh-day-cell level-4" />
            </svg>
          </div>
          <span className="gh-legend-label">More</span>
        </div>
      </div>
    </div>
  );
}
