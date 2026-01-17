
import React from 'react';
import { Task } from '../types';

interface SubtaskSuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  suggestions: string[];
  isLoading: boolean;
}

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
    </div>
);

const CheckIcon = () => (
    <svg className="w-4 h-4 text-purple-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
);

export const SubtaskSuggestionsModal: React.FC<SubtaskSuggestionsModalProps> = ({ isOpen, onClose, task, suggestions, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-lg mx-auto text-white border border-slate-700 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
          Subtask Suggestions
        </h2>
        <p className="text-slate-400 mb-1">For: <span className="font-semibold text-slate-300">{task.title}</span></p>
        <p className="text-xs text-slate-500 mb-6">Powered by Gemini</p>
        
        <div className="flex-grow overflow-y-auto pr-2 max-h-[50vh]">
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <ul className="space-y-3">
                    {suggestions.map((subtask, index) => (
                        <li key={index} className="flex items-start bg-slate-700/50 p-3 rounded-md">
                            <CheckIcon />
                            <span className="text-slate-300">{subtask}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded-md font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
