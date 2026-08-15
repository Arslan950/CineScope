import React from 'react';
import {
    PieChart, Pie, Tooltip, ResponsiveContainer, Cell
} from "recharts";

function parseRating(ratingStr) {
    if (!ratingStr) return { value: 0, max: 10 };
    const [value, max] = ratingStr.split('/').map(Number);
    const score = parseFloat(value);
    const maxScore = parseFloat(max);
    const remainder = Math.max(0, maxScore - score);

    return { score, maxScore, remainder }
}

const RatingChart = ({ rating, size = 160, color = '#10b981' }) => {
    const { score, maxScore, remainder } = parseRating(rating);
    const data = [
        { name: 'Score', value: score },
        { name: 'Remaining', value: remainder },
    ];

    const COLORS = ['#f5c518', '#e5e7eb'];

    return (
        <div className="relative h-56 w-56 bg-amber-400">
            {/* Donut Chart */}
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={90}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>

            {/* Centered Rating Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-extrabold racking-tight">
                    {score}
                </span>
                <span className="text-xs font-semibold uppercase text-gray-500 tracking-wider">
                    out of {maxScore}
                </span>
            </div>
        </div>
    )

}

export default RatingChart;