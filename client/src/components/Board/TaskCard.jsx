import { HiOutlineLink, HiOutlineDocumentText, HiOutlineFolder } from 'react-icons/hi';

const snippetIcons = {
  url: <HiOutlineLink size={12} />,
  note: <HiOutlineDocumentText size={12} />,
  file: <HiOutlineFolder size={12} />,
};

export default function TaskCard({ task, onClick }) {
  const snippetCount = task.contextSnippets?.length || 0;

  return (
    <div className="task-card" onClick={onClick}>
      <h4 className="task-card-title">{task.title}</h4>

      {task.description && (
        <p className="task-card-desc">
          {task.description.length > 80
            ? task.description.slice(0, 80) + '…'
            : task.description}
        </p>
      )}

      {snippetCount > 0 && (
        <div className="task-card-snippets">
          {task.contextSnippets.slice(0, 3).map((s) => (
            <span key={s._id} className={`snippet-badge snippet-badge--${s.type}`} title={s.label}>
              {snippetIcons[s.type]}
              <span>{s.label.length > 18 ? s.label.slice(0, 18) + '…' : s.label}</span>
            </span>
          ))}
          {snippetCount > 3 && (
            <span className="snippet-badge snippet-badge--more">+{snippetCount - 3}</span>
          )}
        </div>
      )}

      {snippetCount === 0 && (
        <div className="task-card-no-context">
          <span>No context attached</span>
        </div>
      )}
    </div>
  );
}
