import React from 'react';

interface HeaderProps {
    startDate: Date;
    onDateChange: (date: string) => void;
    onNavigateWeek: (direction: 'prev' | 'next' | 'today') => void;
    headerColor: string;
    onHeaderColorChange: (color: string) => void;
}

const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

const formatRussianDate = (date: Date): string => {
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
};

const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

const Header: React.FC<HeaderProps> = ({ startDate, onDateChange, onNavigateWeek, headerColor, onHeaderColorChange }) => {
    const sunday = addDays(startDate, 6);
    const weekRange = `${formatRussianDate(startDate)} - ${formatRussianDate(sunday)}`;

    const headerStyle = () => {
        const rgb = hexToRgb(headerColor);
        if (!rgb) return { background: headerColor };
        const darkerColor = `rgb(${Math.max(0, rgb.r - 40)}, ${Math.max(0, rgb.g - 40)}, ${Math.max(0, rgb.b - 40)})`;
        return { background: `linear-gradient(135deg, ${headerColor} 0%, ${darkerColor} 100%)` };
    };

    return (
        <header style={headerStyle()} className="text-white p-6 sm:p-8 text-center relative shadow-md">
            <h1 className="m-0 text-3xl sm:text-4xl font-light tracking-wide">Weekly Habit Planner</h1>
            <p className="text-base sm:text-lg opacity-90 mt-2">{weekRange}</p>
            <div className="my-5 flex justify-center items-center flex-wrap gap-2 sm:gap-4">
                <button aria-label="Previous week" onClick={() => onNavigateWeek('prev')} className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 transition transform hover:-translate-y-0.5">&lt; Назад</button>
                <input
                    type="date"
                    value={startDate.toISOString().split('T')[0]}
                    onChange={(e) => onDateChange(e.target.value)}
                    className="px-4 py-2 rounded-full border-none bg-white/20 text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                    aria-label="Select start date"
                />
                <button onClick={() => onNavigateWeek('today')} className="px-4 py-2 rounded-full bg-white/30 hover:bg-white/40 transition transform hover:-translate-y-0.5 font-semibold">Сегодня</button>
                <button aria-label="Next week" onClick={() => onNavigateWeek('next')} className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 transition transform hover:-translate-y-0.5">Вперед &gt;</button>
            </div>
             <div className="absolute top-4 right-4 group">
                <input
                    type="color"
                    value={headerColor}
                    onChange={(e) => onHeaderColorChange(e.target.value)}
                    className="color-picker w-10 h-10 p-0 border-2 border-white/50 rounded-full cursor-pointer bg-transparent appearance-none transition-transform group-hover:scale-110"
                    aria-label="Change header color"
                />
            </div>
        </header>
    );
};

export default Header;
