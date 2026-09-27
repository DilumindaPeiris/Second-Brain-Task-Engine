import { useState, useMemo } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import Column from './Column';
import TaskModal from '../TaskModal/TaskModal';
import SearchBar from './SearchBar';
import EmptyBoard from './EmptyBoard';
import useTasks from '../../hooks/useTasks';
import useKeyboardShortcut from '../../hooks/useKeyboardShortcut';
import { HiOutlinePlus } from 'react-icons/hi';

const COLUMN_CONFIG = [
  { id: 'todo', title: 'To Do', emoji: '📋' },
  { id: 'in-progress', title: 'In Progress', emoji: '🔥' },
  { id: 'done', title: 'Done', emoji: '✅' },
];

export default function KanbanBoard() {
  const { tasks, columns, loading, createTask, updateTask, deleteTask, reorderTasks, addSnippet, removeSnippet } = useTasks();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState('todo');
  const [searchQuery, setSearchQuery] = useState('');

  // Keyboard shortcut: Press 'c' to create a new task
  useKeyboardShortcut('c', () => openCreateModal(), { enabled: !modalOpen });

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    // ... (rest of drag logic remains the same, we'll keep it simple for now)
    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;

    const allColumns = { ...columns };
    const sourceItems = [...allColumns[sourceCol]];
    const destItems = sourceCol === destCol ? sourceItems : [...allColumns[destCol]];

    const [movedTask] = sourceItems.splice(source.index, 1);
    const updatedTask = { ...movedTask, status: destCol };
    destItems.splice(destination.index, 0, updatedTask);

    const payload = [];
    const addColumn = (items, status) => {
      items.forEach((task, index) => {
        payload.push({ id: task._id, status, order: index });
      });
    };

    addColumn(sourceCol === destCol ? destItems : sourceItems, sourceCol);
    if (sourceCol !== destCol) {
      addColumn(destItems, destCol);
    }

    reorderTasks(payload);
  };

  const openCreateModal = (status = 'todo') => {
    setEditingTask(null);
    setDefaultStatus(status);
    setModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleSave = async (taskData) => {
    if (editingTask) {
      await updateTask(editingTask._id, taskData);
    } else {
      await createTask({ ...taskData, status: defaultStatus });
    }
    setModalOpen(false);
    setEditingTask(null);
  };

  const handleDelete = async (taskId) => {
    await deleteTask(taskId);
    setModalOpen(false);
    setEditingTask(null);
  };

  // Filter tasks based on search query
  const filteredColumns = useMemo(() => {
    if (!searchQuery) return columns;
    const lowerQuery = searchQuery.toLowerCase();
    const filterFn = (t) => 
      t.title.toLowerCase().includes(lowerQuery) || 
      (t.description && t.description.toLowerCase().includes(lowerQuery));

    return {
      'todo': (columns['todo'] || []).filter(filterFn),
      'in-progress': (columns['in-progress'] || []).filter(filterFn),
      'done': (columns['done'] || []).filter(filterFn),
    };
  }, [columns, searchQuery]);


  if (loading) {
    return (
      <div className="board-loader">
        {COLUMN_CONFIG.map((col) => (
          <div key={col.id} className="column-skeleton">
            <div className="skeleton skeleton-header" />
            <div className="skeleton skeleton-card" />
            <div className="skeleton skeleton-card short" />
            <div className="skeleton skeleton-card" />
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0 && !searchQuery) {
    return (
      <>
        <EmptyBoard onCreateTask={() => openCreateModal()} />
        {modalOpen && (
          <TaskModal
            task={null}
            onSave={handleSave}
            onClose={() => setModalOpen(false)}
            onAddSnippet={addSnippet}
            onRemoveSnippet={removeSnippet}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="board-header">
        <div>
          <h2 className="board-title">Your Workspace</h2>
          <p className="board-subtitle">Drag tasks between columns to update their status</p>
        </div>
        <div className="board-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <SearchBar onSearch={setSearchQuery} />
            <button className="btn btn-primary" onClick={() => openCreateModal()}>
            <HiOutlinePlus size={18} />
            New Task
            </button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="board">
          {COLUMN_CONFIG.map((col) => (
            <Column
              key={col.id}
              columnId={col.id}
              title={col.title}
              emoji={col.emoji}
              tasks={filteredColumns[col.id] || []}
              onTaskClick={openEditModal}
              onAddClick={() => openCreateModal(col.id)}
            />
          ))}
        </div>
      </DragDropContext>

      {modalOpen && (
        <TaskModal
          task={editingTask}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => { setModalOpen(false); setEditingTask(null); }}
          onAddSnippet={addSnippet}
          onRemoveSnippet={removeSnippet}
        />
      )}
    </>
  );
}
