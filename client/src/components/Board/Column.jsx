import { Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import { HiOutlinePlus } from 'react-icons/hi';

export default function Column({ columnId, title, emoji, tasks, onTaskClick, onAddClick }) {
  return (
    <div className="column">
      <div className="column-header">
        <div className="column-title-row">
          <span className="column-emoji">{emoji}</span>
          <h3 className="column-title">{title}</h3>
          <span className="column-count">{tasks.length}</span>
        </div>
        <button className="btn btn-ghost btn-sm column-add-btn" onClick={onAddClick} title={`Add to ${title}`}>
          <HiOutlinePlus size={16} />
        </button>
      </div>

      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            className={`column-body ${snapshot.isDraggingOver ? 'column-body--dragover' : ''}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.map((task, index) => (
              <Draggable key={task._id} draggableId={task._id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`task-card-wrapper ${snapshot.isDragging ? 'task-card-wrapper--dragging' : ''}`}
                  >
                    <TaskCard task={task} onClick={() => onTaskClick(task)} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}

            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="column-empty">
                <p>No tasks yet</p>
                <button className="btn btn-ghost btn-sm" onClick={onAddClick}>
                  <HiOutlinePlus size={14} /> Add a task
                </button>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
