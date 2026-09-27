import { useState } from 'react';
import { HiOutlineLink, HiOutlineDocumentText, HiOutlineFolder, HiOutlineTrash, HiOutlinePlus, HiOutlineX } from 'react-icons/hi';

const snippetIcons = {
  url: <HiOutlineLink size={14} />,
  note: <HiOutlineDocumentText size={14} />,
  file: <HiOutlineFolder size={14} />,
};

const snippetLabels = {
  url: 'URL / Link',
  note: 'Text Note',
  file: 'File Path',
};

export default function TaskModal({ task, onSave, onDelete, onClose, onAddSnippet, onRemoveSnippet }) {
  const isEditing = !!task;
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [snippets, setSnippets] = useState(task?.contextSnippets || []);
  const [saving, setSaving] = useState(false);

  // New snippet form state
  const [showSnippetForm, setShowSnippetForm] = useState(false);
  const [snippetType, setSnippetType] = useState('url');
  const [snippetLabel, setSnippetLabel] = useState('');
  const [snippetValue, setSnippetValue] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        description: description.trim(),
        contextSnippets: isEditing ? undefined : snippets,
      });
    } catch {
      // handled in hook
    } finally {
      setSaving(false);
    }
  };

  const handleAddSnippet = async () => {
    if (!snippetLabel.trim() || !snippetValue.trim()) return;
    const newSnippet = { type: snippetType, label: snippetLabel.trim(), value: snippetValue.trim() };

    if (isEditing) {
      // Persist immediately via API
      try {
        await onAddSnippet(task._id, newSnippet);
        // Re-read is done via the hook's state update
      } catch {
        return;
      }
    } else {
      // For new tasks, accumulate locally
      setSnippets(prev => [...prev, { ...newSnippet, _id: Date.now().toString(), addedAt: new Date().toISOString() }]);
    }

    setSnippetLabel('');
    setSnippetValue('');
    setShowSnippetForm(false);
  };

  const handleRemoveSnippet = async (snippetId) => {
    if (isEditing) {
      await onRemoveSnippet(task._id, snippetId);
    } else {
      setSnippets(prev => prev.filter(s => s._id !== snippetId));
    }
  };

  // For editing mode, use task's live snippets from the hook
  const displaySnippets = isEditing ? (task?.contextSnippets || []) : snippets;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Task' : 'New Task'}</h2>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <HiOutlineX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label htmlFor="task-title">Title</label>
            <input
              id="task-title"
              type="text"
              className="form-input"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-desc">Description</label>
            <textarea
              id="task-desc"
              className="form-input form-textarea"
              placeholder="Add details, notes, or instructions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Context Snippets Section */}
          <div className="form-group">
            <div className="snippets-header">
              <label>Context Snippets</label>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setShowSnippetForm(!showSnippetForm)}
              >
                <HiOutlinePlus size={14} />
                Add Context
              </button>
            </div>

            {showSnippetForm && (
              <div className="snippet-form">
                <div className="snippet-form-row">
                  <div className="snippet-type-selector">
                    {(['url', 'note', 'file']).map((type) => (
                      <button
                        key={type}
                        type="button"
                        className={`snippet-type-btn ${snippetType === type ? 'active' : ''}`}
                        onClick={() => setSnippetType(type)}
                      >
                        {snippetIcons[type]}
                        <span>{snippetLabels[type]}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Label (e.g., 'Design Doc')"
                  value={snippetLabel}
                  onChange={(e) => setSnippetLabel(e.target.value)}
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder={
                    snippetType === 'url'
                      ? 'https://...'
                      : snippetType === 'file'
                        ? '/path/to/file'
                        : 'Your note...'
                  }
                  value={snippetValue}
                  onChange={(e) => setSnippetValue(e.target.value)}
                />
                <div className="snippet-form-actions">
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowSnippetForm(false)}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={handleAddSnippet}
                    disabled={!snippetLabel.trim() || !snippetValue.trim()}
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            <div className="snippets-list">
              {displaySnippets.map((s) => (
                <div key={s._id} className={`snippet-item snippet-item--${s.type}`}>
                  <div className="snippet-item-icon">{snippetIcons[s.type]}</div>
                  <div className="snippet-item-content">
                    <span className="snippet-item-label">{s.label}</span>
                    <span className="snippet-item-value">
                      {s.type === 'url' ? (
                        <a href={s.value} target="_blank" rel="noopener noreferrer">{s.value}</a>
                      ) : (
                        s.value
                      )}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm snippet-remove-btn"
                    onClick={() => handleRemoveSnippet(s._id)}
                    title="Remove"
                  >
                    <HiOutlineTrash size={14} />
                  </button>
                </div>
              ))}
              {displaySnippets.length === 0 && (
                <p className="snippets-empty">No context attached yet. Add URLs, notes, or file paths to help you complete this task.</p>
              )}
            </div>
          </div>

          <div className="modal-footer">
            {isEditing && (
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(task._id)}
              >
                <HiOutlineTrash size={14} />
                Delete Task
              </button>
            )}
            <div className="modal-footer-right">
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving || !title.trim()}>
                {saving ? <span className="spinner-sm" /> : isEditing ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
