import React from 'react';
import {
    PieChart, Pie, Tooltip, ResponsiveContainer, Cell
} from "recharts";

function parseRating(ratingStr) {
    if (!ratingStr) return { score: 0, maxScore: 10, remainder: 10 };
    const [value, max] = ratingStr.split('/').map(Number);
    const score = parseFloat(value);
    const maxScore = parseFloat(max) || 10;
    const remainder = Math.max(0, maxScore - score);

    return { score, maxScore, remainder };
}

const getScoreColor = (score, maxScore) => {
    const percentage = score / maxScore;
    if (percentage >= 0.75) return '#10B981'; 
    if (percentage >= 0.50) return '#F5C518'; 
    return '#EF4444'; // Red
};

const RatingChart = ({ rating}) => {
    const { score, maxScore, remainder } = parseRating(rating);
    const data = [
        { name: 'Score', value: score },
        { name: 'Remaining', value: remainder },
    ];

    const activeColor = getScoreColor(score, maxScore);
    const COLORS = [activeColor, '#1f2937'];

    return (
        <div className="relative flex items-center justify-center w-56 h-56 transition-transform duration-300 hover:scale-105">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={75}
                        outerRadius={95}
                        startAngle={90} 
                        endAngle={450}  
                        dataKey="value"
                        stroke="none"
                        cornerRadius={10}
                    >
                        {data.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={COLORS[index % COLORS.length]} 
                                className="transition-all duration-500 ease-in-out hover:opacity-90"
                            />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-5xl font-black tracking-tighter text-gray-900 drop-shadow-sm dark:text-white">
                    {score}
                </span>
                <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                    / {maxScore}
                </span>
            </div>
        </div>
    );
};

export default RatingChart;