import React, { useState, useEffect, useCallback } from 'react';
import { PlannerData, Task, DraggedItem, Day } from './types';
import Header from './components/Header';
import PlannerGrid from './components/PlannerGrid';

const DAYS = ['понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье'];
const DAY_COLORS = ['#FEE2E2', '#E0E7FF', '#D1FAE5', '#FEF3C7', '#F3E8FF', '#E5E7EB', '#FFE4E6'];

const getMonday = (date: Date): Date => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
};

const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

const formatRussianDate = (date: Date): string => {
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
};

const App: React.FC = () => {
    const [startDate, setStartDate] = useState(() => getMonday(new Date()));
    const [plannerData, setPlannerData] = useState<PlannerData>([]);
    const [headerColor, setHeaderColor] = useState('#6366F1');
    const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null);
    const [dropTarget, setDropTarget] = useState<{ dayIndex: number; insertAtIndex: number } | null>(null);

    const initializePlanner = useCallback((currentStartDate: Date) => {
        const dateKey = currentStartDate.toISOString().split('T')[0];
        const savedData = localStorage.getItem(`planner-${dateKey}`);
        
        if (savedData) {
            setPlannerData(JSON.parse(savedData));
            return;
        }

        const newPlannerData = DAYS.map((dayName, index) => {
            const date = addDays(currentStartDate, index);
            return {
                name: dayName,
                date: formatRussianDate(date),
                tasks: [],
                color: DAY_COLORS[index],
            };
        });
        setPlannerData(newPlannerData);
    }, []);

    useEffect(() => {
        initializePlanner(startDate);
    }, [startDate, initializePlanner]);
    
    useEffect(() => {
        const savedHeaderColor = localStorage.getItem('plannerHeaderColor');
        if (savedHeaderColor) setHeaderColor(savedHeaderColor);
    }, []);

    useEffect(() => {
        if (plannerData.length === 0) return;
        const dateKey = startDate.toISOString().split('T')[0];
        localStorage.setItem(`planner-${dateKey}`, JSON.stringify(plannerData));
    }, [plannerData, startDate]);
    
    useEffect(() => {
        localStorage.setItem('plannerHeaderColor', headerColor);
    }, [headerColor]);

    const handleDateChange = (dateString: string) => {
        const date = new Date(dateString);
        // Adjust for timezone offset
        const userTimezoneOffset = date.getTimezoneOffset() * 60000;
        setStartDate(getMonday(new Date(date.getTime() + userTimezoneOffset)));
    };

    const handleNavigateWeek = (direction: 'prev' | 'next' | 'today') => {
        if (direction === 'today') {
            setStartDate(getMonday(new Date()));
        } else {
            setStartDate(current => addDays(current, direction === 'prev' ? -7 : 7));
        }
    };

    const updateDay = (dayIndex: number, updatedProps: Partial<Day>) => {
        setPlannerData(p => p.map((day, i) => i === dayIndex ? { ...day, ...updatedProps } : day));
    };
    
    const handleDragStart = (task: Task, fromDayIndex: number, fromTaskIndex: number) => {
        document.body.classList.add('dragging');
        setDraggedItem({ task, fromDayIndex, fromTaskIndex });
    };

    const handleDragEnd = () => {
        document.body.classList.remove('dragging');
        setDraggedItem(null);
        setDropTarget(null);
    };
    
    const handleDrop = () => {
        if (!draggedItem || !dropTarget) {
            handleDragEnd();
            return;
        }

        const { task, fromDayIndex, fromTaskIndex } = draggedItem;
        const { dayIndex: toDayIndex, insertAtIndex: toInsertAtIndex } = dropTarget;

        setPlannerData(currentData => {
            const newData = JSON.parse(JSON.stringify(currentData));

            // Remove task from source
            const sourceTasks = newData[fromDayIndex].tasks;
            sourceTasks.splice(fromTaskIndex, 1);

            // Add task to destination
            const destinationTasks = newData[toDayIndex].tasks;
            destinationTasks.splice(toInsertAtIndex, 0, task);
            
            return newData;
        });
        
        handleDragEnd();
    };

    return (
        <div className="container max-w-screen-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden min-h-screen flex flex-col">
           <Header
               startDate={startDate}
               onDateChange={handleDateChange}
               onNavigateWeek={handleNavigateWeek}
               headerColor={headerColor}
               onHeaderColorChange={setHeaderColor}
           />
           <PlannerGrid 
                plannerData={plannerData}
                updateDay={updateDay}
                draggedItem={draggedItem}
                dropTarget={dropTarget}
                onDragStart={handleDragStart}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                setDropTarget={setDropTarget}
            />
        </div>
    );
};

export default App;
