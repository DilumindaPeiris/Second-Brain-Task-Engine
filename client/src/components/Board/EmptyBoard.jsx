import { HiOutlineLightningBolt, HiOutlinePlus } from 'react-icons/hi';

/**
 * Welcome screen shown when the board has zero tasks.
 * Provides a quick onboarding experience.
 */
export default function EmptyBoard({ onCreateTask }) {
  return (
    <div className="empty-board">
      <div className="empty-board-icon">
        <HiOutlineLightningBolt size={48} />
      </div>
      <h2 className="empty-board-title">Your Second Brain is ready</h2>
      <p className="empty-board-desc">
        Start by creating your first task. Attach context snippets — URLs, notes,
        and file paths — so you always have the right information at your fingertips.
      </p>
      <button className="btn btn-primary" onClick={onCreateTask}>
        <HiOutlinePlus size={18} />
        Create Your First Task
      </button>
    </div>
  );
}
