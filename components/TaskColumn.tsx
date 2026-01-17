
import React from 'react';
import { Task, Status } from '../types';
import { TaskCard } from './TaskCard';

interface TaskColumnProps {
  status: Status;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onDragStart: (taskId: string) => void;
  onDrop: (status: Status) => void;
  isDraggedOver: boolean;
}

const statusConfig = {
  [Status.ToDo]: {
    color: 'bg-blue-500',
    title: 'To Do',
  },
  [Status.InProgress]: {
    color: 'bg-yellow-500',
    title: 'In Progress',
  },
  [Status.Done]: {
    color: 'bg-green-500',
    title: 'Done',
  },
};

export const TaskColumn: React.FC<TaskColumnProps> = ({ status, tasks, onEditTask, onDeleteTask, onDragStart, onDrop }) => {
  const [isOver, setIsOver] = React.useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(true);
  };
  
  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = () => {
    onDrop(status);
    setIsOver(false);
  };

  const config = statusConfig[status];

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`rounded-xl p-4 transition-all duration-300 ${isOver ? 'bg-slate-700/80 ring-2 ring-purple-500' : 'bg-slate-800'}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${config.color}`}></div>
          <h2 className="font-bold text-lg text-slate-200">{config.title}</h2>
        </div>
        <span className="bg-slate-700 text-slate-300 text-sm font-semibold px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>
      <div className="space-y-4 min-h-[200px]">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            onDragStart={onDragStart}
          />
        ))}
      </div>
    </div>
  );
};
