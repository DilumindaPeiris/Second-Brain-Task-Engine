import useStats from '../../hooks/useStats';
import { HiOutlineChartBar, HiOutlineFire, HiOutlineCheckCircle, HiOutlineClock } from 'react-icons/hi';

/**
 * Stats panel showing task metrics at the top of the board.
 */
export default function StatsPanel() {
  const { stats, loading } = useStats();

  if (loading || !stats) {
    return (
      <div className="stats-panel">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="stat-card">
            <div className="skeleton skeleton-stat" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: 'Total Tasks',
      value: stats.total,
      icon: <HiOutlineChartBar size={20} />,
      color: 'accent',
    },
    {
      label: 'In Progress',
      value: stats.byStatus?.['in-progress'] || 0,
      icon: <HiOutlineFire size={20} />,
      color: 'warning',
    },
    {
      label: 'Completed',
      value: stats.byStatus?.done || 0,
      icon: <HiOutlineCheckCircle size={20} />,
      color: 'success',
    },
    {
      label: 'Overdue',
      value: stats.overdue || 0,
      icon: <HiOutlineClock size={20} />,
      color: 'danger',
    },
  ];

  return (
    <div className="stats-panel">
      {cards.map((card) => (
        <div key={card.label} className={`stat-card stat-card--${card.color}`}>
          <div className="stat-card-icon">{card.icon}</div>
          <div className="stat-card-content">
            <span className="stat-card-value">{card.value}</span>
            <span className="stat-card-label">{card.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
