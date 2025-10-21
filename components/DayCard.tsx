import React, { useState, useMemo } from 'react';
import { Day, Task, DraggedItem, PlannerData } from '../types';
import ProgressCircle from './ProgressCircle';
import TaskList from './TaskList';

interface DayCardProps {
    day: Day;
    dayIndex: number;
    updateDay: (dayIndex: number, updatedDay: Partial<Day>) => void;
    draggedItem: DraggedItem | null;
    dropTarget: { dayIndex: number; insertAtIndex: number } | null;
    onDragStart: (task: Task, fromDayIndex: number, fromTaskIndex: number) => void;
    setDropTarget: React.Dispatch<React.SetStateAction<{ dayIndex: number; insertAtIndex: number } | null>>;
}

const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

const getTextColor = (bgColor: string): string => {
    const rgb = hexToRgb(bgColor);
    if (!rgb) return '#1f2937';
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness > 140 ? '#1f2937' : '#ffffff';
};


const DayCard: React.FC<DayCardProps> = ({ day, dayIndex, updateDay, ...restProps }) => {
    const [newTaskText, setNewTaskText] = useState('');
    const textColor = useMemo(() => getTextColor(day.color), [day.color]);
    
    const progress = useMemo(() => {
        if (day.tasks.length === 0) return 0;
        const completed = day.tasks.filter(task => task.completed).length;
        return Math.round((completed / day.tasks.length) * 100);
    }, [day.tasks]);
    
    const handleAddTask = () => {
        if (newTaskText.trim() === '') return;
        const newTask: Task = {
            id: `task-${dayIndex}-${Date.now()}`,
            text: newTaskText.trim(),
            completed: false,
        };
        updateDay(dayIndex, { tasks: [...day.tasks, newTask] });
        setNewTaskText('');
    };

    const handleClearCompleted = () => {
        updateDay(dayIndex, { tasks: day.tasks.filter(t => !t.completed) });
    };
    
    const hasCompletedTasks = useMemo(() => day.tasks.some(t => t.completed), [day.tasks]);

    return (
        <div style={{ backgroundColor: day.color, color: textColor }} className="rounded-2xl p-5 shadow-lg transition-transform hover:-translate-y-1.5 flex flex-col h-full">
            <header className="text-center mb-4 pb-4 border-b-2" style={{borderColor: `${textColor}33`}}>
                <div className="relative flex justify-center items-center">
                    <h2 className="text-2xl font-bold capitalize">{day.name}</h2>
                    <div className="absolute top-0 left-0">
                         <input
                            type="color"
                            value={day.color}
                            onChange={(e) => updateDay(dayIndex, { color: e.target.value })}
                            className="color-picker w-7 h-7 p-0 border-2 rounded-full cursor-pointer bg-transparent appearance-none transition-transform hover:scale-110"
                            style={{borderColor: `${textColor}80`}}
                            aria-label="Change card color"
                        />
                    </div>
                </div>
                <p className="text-sm opacity-80 mt-1">{day.date}</p>
            </header>

            <section className="mb-5 text-center">
                 <h3 className="font-bold text-lg mb-2">Прогресс</h3>
                 <ProgressCircle percentage={progress} color={textColor}/>
            </section>

            <section className="flex flex-col flex-grow mt-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-center">Ежедневные задачи</h3>
                    {hasCompletedTasks && (
                         <button 
                            onClick={handleClearCompleted} 
                            className="text-xs px-2 py-1 rounded-md transition-colors"
                            style={{backgroundColor: `${textColor}26`, color: textColor}}
                            aria-label="Clear completed tasks"
                        >
                            Очистить
                        </button>
                    )}
                </div>
                <div className="flex gap-2.5 mb-4">
                    <input 
                        type="text"
                        value={newTaskText}
                        onChange={(e) => setNewTaskText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                        placeholder="Добавить задачу..."
                        className="flex-1 px-4 py-2 text-sm rounded-full outline-none focus:ring-2"
                        style={{ 
                            backgroundColor: `${textColor}26`, 
                            color: textColor,
                            borderColor: `${textColor}4D`,
                            '--tw-ring-color': `${textColor}99`,
                         }}
                         aria-label="New task input"
                    />
                     <button onClick={handleAddTask} className="px-4 py-2 rounded-full font-semibold transition-transform transform hover:scale-105 active:scale-100" style={{backgroundColor: `${textColor}33`}} aria-label="Add task">
                        +
                    </button>
                </div>
                <TaskList
                    tasks={day.tasks}
                    dayIndex={dayIndex}
                    textColor={textColor}
                    updateDay={updateDay}
                    {...restProps}
                />
            </section>
        </div>
    );
};

export default DayCard;
