
import React, { useState } from 'react';
import { Task } from '../types';
import { generateSubtasks } from '../services/geminiService';
import { SubtaskSuggestionsModal } from './SubtaskSuggestionsModal';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onDragStart: (taskId: string) => void;
}

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" /></svg>
);

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
);

const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v2.586l1.293-1.293a1 1 0 111.414 1.414L12.414 8H15a1 1 0 110 2h-2.586l1.293 1.293a1 1 0 11-1.414 1.414L11 11.414V14a1 1 0 11-2 0v-2.586l-1.293 1.293a1 1 0 11-1.414-1.414L7.586 10H5a1 1 0 110-2h2.586L6.293 6.707a1 1 0 111.414-1.414L9 6.586V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);


export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onDragStart }) => {
  const [isSubtaskModalOpen, setIsSubtaskModalOpen] = useState(false);
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [isLoadingSubtasks, setIsLoadingSubtasks] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('taskId', task.id);
    onDragStart(task.id);
  };
  
  const handleGetSuggestions = async () => {
    setIsSubtaskModalOpen(true);
    setIsLoadingSubtasks(true);
    try {
      const suggestions = await generateSubtasks(task.title, task.description);
      setSubtasks(suggestions);
    } catch (error) {
      console.error("Failed to get subtask suggestions:", error);
      setSubtasks(["Sorry, couldn't fetch suggestions at the moment."]);
    } finally {
      setIsLoadingSubtasks(false);
    }
  };

  return (
    <>
      <div
        draggable="true"
        onDragStart={handleDragStart}
        className="bg-slate-700/50 p-4 rounded-lg shadow-md border border-slate-600 cursor-grab active:cursor-grabbing hover:bg-slate-700 transition-all group"
      >
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-slate-100 pr-4">{task.title}</h3>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onEdit(task)} className="text-slate-400 hover:text-blue-400"><EditIcon /></button>
            <button onClick={() => onDelete(task.id)} className="text-slate-400 hover:text-red-400"><DeleteIcon /></button>
          </div>
        </div>
        <p className="text-sm text-slate-400 mt-2 mb-4">{task.description}</p>
        <div className="flex justify-end">
            <button
                onClick={handleGetSuggestions}
                className="flex items-center gap-1 text-xs bg-purple-600/50 text-purple-200 px-3 py-1 rounded-md hover:bg-purple-600/80 transition-colors"
            >
                <SparklesIcon />
                <span>Suggest Subtasks</span>
            </button>
        </div>
      </div>
      <SubtaskSuggestionsModal 
        isOpen={isSubtaskModalOpen}
        onClose={() => setIsSubtaskModalOpen(false)}
        task={task}
        suggestions={subtasks}
        isLoading={isLoadingSubtasks}
      />
    </>
  );
};
