import React from 'react';

interface ProgressCircleProps {
    percentage: number;
    color: string;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({ percentage, color }) => {
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                <circle
                    className="stroke-current opacity-30"
                    style={{color: color}}
                    strokeWidth="8"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                />
                <circle
                    className="stroke-current"
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                    strokeDasharray={circumference}
                    style={{ 
                        strokeDashoffset,
                        color: color, 
                        transition: 'stroke-dashoffset 0.5s ease-out' 
                    }}
                />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xl sm:text-2xl font-bold" style={{color: color}}>
                {`${Math.round(percentage)}%`}
            </span>
        </div>
    );
};

export default ProgressCircle;
