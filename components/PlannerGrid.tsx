import React from 'react';
import { PlannerData, Day, DraggedItem, Task } from '../types';
import DayCard from './DayCard';

interface PlannerGridProps {
    plannerData: PlannerData;
    updateDay: (dayIndex: number, updatedDay: Partial<Day>) => void;
    draggedItem: DraggedItem | null;
    dropTarget: { dayIndex: number; insertAtIndex: number } | null;
    onDragStart: (task: Task, fromDayIndex: number, fromTaskIndex: number) => void;
    onDrop: () => void;
    onDragEnd: () => void;
    setDropTarget: React.Dispatch<React.SetStateAction<{ dayIndex: number; insertAtIndex: number } | null>>;
}

const PlannerGrid: React.FC<PlannerGridProps> = (props) => {
    return (
        <main 
            className="grid gap-6 p-6 sm:p-8 grid-cols-[repeat(auto-fit,minmax(320px,1fr))] flex-grow"
            onDrop={props.onDrop}
            onDragEnd={props.onDragEnd}
        >
            {props.plannerData.map((day, index) => (
                <DayCard
                    key={`${day.name}-${index}`}
                    day={day}
                    dayIndex={index}
                    updateDay={props.updateDay}
                    draggedItem={props.draggedItem}
                    dropTarget={props.dropTarget}
                    onDragStart={props.onDragStart}
                    setDropTarget={props.setDropTarget}
                />
            ))}
        </main>
    );
};

export default PlannerGrid;
