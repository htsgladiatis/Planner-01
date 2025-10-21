import React from 'react';
import { Task, DraggedItem, Day } from '../types';
import TaskItem from './TaskItem';

interface TaskListProps {
    tasks: Task[];
    dayIndex: number;
    textColor: string;
    updateDay: (dayIndex: number, updatedDay: Partial<Day>) => void;
    draggedItem: DraggedItem | null;
    dropTarget: { dayIndex: number; insertAtIndex: number } | null;
    onDragStart: (task: Task, fromDayIndex: number, fromTaskIndex: number) => void;
    setDropTarget: React.Dispatch<React.SetStateAction<{ dayIndex: number; insertAtIndex: number } | null>>;
}

const getDragAfterElement = (container: HTMLElement, y: number): { element: HTMLElement | null, index: number } => {
    const draggableElements = Array.from(container.querySelectorAll('.task-item:not(.dragging-source)'));
    let closest = { offset: Number.NEGATIVE_INFINITY, element: null as HTMLElement | null, index: draggableElements.length };

    draggableElements.forEach((child, index) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            closest = { offset: offset, element: child as HTMLElement, index: index };
        }
    });
    return { element: closest.element, index: closest.index };
};


const TaskList: React.FC<TaskListProps> = ({ tasks, dayIndex, textColor, updateDay, draggedItem, dropTarget, onDragStart, setDropTarget }) => {

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!draggedItem) return;
        const { index } = getDragAfterElement(e.currentTarget, e.clientY);
        setDropTarget({ dayIndex, insertAtIndex: index });
    };

    const isDropTarget = dropTarget?.dayIndex === dayIndex;

    return (
        <div 
            className="tasks-container min-h-[80px] rounded-lg p-1 transition-all flex-grow"
            onDragOver={handleDragOver}
            onDragLeave={() => setDropTarget(null)}
        >
            {tasks.length === 0 && !isDropTarget && (
                <div className="flex items-center justify-center h-full text-sm opacity-70">
                    Нет задач на сегодня.
                </div>
            )}

            {tasks.map((task, index) => {
                const showIndicator = isDropTarget && dropTarget.insertAtIndex === index;
                return (
                    <React.Fragment key={task.id}>
                        {showIndicator && <DropIndicator />}
                        <TaskItem
                            task={task}
                            taskIndex={index}
                            dayIndex={dayIndex}
                            updateDay={updateDay}
                            tasks={tasks}
                            textColor={textColor}
                            onDragStart={onDragStart}
                            isDragging={draggedItem?.task.id === task.id}
                        />
                    </React.Fragment>
                );
            })}
            
            {isDropTarget && dropTarget.insertAtIndex === tasks.length && <DropIndicator />}

        </div>
    );
};

const DropIndicator = () => (
    <div className="h-1 my-1.5 bg-indigo-400 rounded-full w-full" />
);

export default TaskList;
