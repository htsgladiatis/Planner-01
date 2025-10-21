import React, { useState, useRef, useEffect } from 'react';
import { Task, Day } from '../types';

interface TaskItemProps {
    task: Task;
    taskIndex: number;
    dayIndex: number;
    tasks: Task[];
    updateDay: (dayIndex: number, updatedDay: Partial<Day>) => void;
    textColor: string;
    onDragStart: (task: Task, fromDayIndex: number, fromTaskIndex: number) => void;
    isDragging: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, taskIndex, dayIndex, tasks, updateDay, textColor, onDragStart, isDragging }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(task.text);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [isEditing]);
    
    const updateTasks = (newTasks: Task[]) => {
        updateDay(dayIndex, { tasks: newTasks });
    };

    const handleToggle = () => {
        const newTasks = tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t);
        updateTasks(newTasks);
    };

    const handleDelete = () => {
        const newTasks = tasks.filter(t => t.id !== task.id);
        updateTasks(newTasks);
    };
    
    const handleSaveEdit = () => {
        if (editText.trim()) {
            const newTasks = tasks.map(t => t.id === task.id ? { ...t, text: editText.trim() } : t);
            updateTasks(newTasks);
        } else {
            setEditText(task.text);
        }
        setIsEditing(false);
    };

    const itemClasses = `task-item group flex items-center mb-2 px-3 py-2.5 rounded-xl transition-all duration-300 ${task.completed ? 'opacity-60' : ''} ${isDragging ? 'opacity-30 dragging-source' : 'hover:shadow-md'}`;
    const handleClasses = `drag-handle mr-2 text-lg cursor-grab transition-opacity duration-300 opacity-20 group-hover:opacity-80`;

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(task, dayIndex, taskIndex)}
            className={itemClasses}
            style={{ backgroundColor: `${textColor}1A` }}
        >
            <div className={handleClasses} style={{color: textColor}} aria-label="Drag to reorder">⋮⋮</div>
            <input 
                type="checkbox" 
                checked={task.completed} 
                onChange={handleToggle}
                className="w-5 h-5 mr-3 rounded cursor-pointer bg-transparent border-2"
                style={{ borderColor: `${textColor}80`, accentColor: textColor }}
                aria-labelledby={`task-text-${task.id}`}
            />
            {isEditing ? (
                <input
                    ref={inputRef}
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={handleSaveEdit}
                    onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                    className="flex-1 text-base bg-transparent border-b-2 outline-none"
                    style={{ borderColor: `${textColor}80` }}
                    aria-label="Edit task text"
                />
            ) : (
                <span 
                    id={`task-text-${task.id}`}
                    onClick={() => setIsEditing(true)} 
                    className={`flex-1 text-base cursor-pointer py-1 ${task.completed ? 'line-through' : ''}`}
                >
                    {task.text}
                </span>
            )}
            <div className="flex items-center ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                    onClick={() => setIsEditing(true)}
                    className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-black/10"
                    aria-label="Edit task"
                >
                    ✏️
                </button>
                <button 
                    onClick={handleDelete}
                    className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-black/10"
                    aria-label="Delete task"
                >
                    🗑️
                </button>
            </div>
        </div>
    );
};

export default TaskItem;
