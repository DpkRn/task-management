
import React, { useState, useEffect, useCallback } from 'react';
import { Task, Status } from './types';
import { STATUSES } from './constants';
import { TaskColumn } from './components/TaskColumn';
import { TaskModal } from './components/TaskModal';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      // Add some sample tasks if none are saved
      const sampleTasks: Task[] = [
        { id: '1', title: 'Design Landing Page', description: 'Create mockups and wireframes for the new landing page.', status: Status.ToDo },
        { id: '2', title: 'Develop API Endpoints', description: 'Set up the required API endpoints for user authentication.', status: Status.InProgress },
        { id: '3', title: 'Deploy Staging Server', description: 'Push the latest build to the staging environment for testing.', status: Status.Done },
      ];
      setTasks(sampleTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const openAddTaskModal = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const openEditTaskModal = (task: Task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTaskToEdit(null);
  };

  const handleSaveTask = (task: Omit<Task, 'id' | 'status'>) => {
    if (taskToEdit) {
      setTasks(tasks.map(t => t.id === taskToEdit.id ? { ...taskToEdit, ...task } : t));
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        ...task,
        status: Status.ToDo,
      };
      setTasks([...tasks, newTask]);
    }
    handleCloseModal();
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };
  
  const handleDragStart = (taskId: string) => {
    setDraggedTaskId(taskId);
  };

  const handleDrop = (status: Status) => {
    if (!draggedTaskId) return;

    const taskToMove = tasks.find(t => t.id === draggedTaskId);
    if (taskToMove && taskToMove.status !== status) {
        const updatedTasks = tasks.map(t =>
            t.id === draggedTaskId ? { ...t, status } : t
        );
        setTasks(updatedTasks);
    }
    setDraggedTaskId(null);
  };

  const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <div className="text-center sm:text-left mb-4 sm:mb-0">
          <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            Gemini Task Manager
          </h1>
          <p className="text-slate-400 mt-1">A smarter way to manage your projects.</p>
        </div>
        <button
          onClick={openAddTaskModal}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
        >
          <PlusIcon />
          <span>Add Task</span>
        </button>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {STATUSES.map(status => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks.filter(task => task.status === status)}
            onEditTask={openEditTaskModal}
            onDeleteTask={handleDeleteTask}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            isDraggedOver={tasks.some(t => t.id === draggedTaskId && t.status !== status)}
          />
        ))}
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
      />
    </div>
  );
};

export default App;
