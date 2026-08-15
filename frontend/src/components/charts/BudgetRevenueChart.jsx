import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Cell, LabelList, ResponsiveContainer } from "recharts";
import millify from 'millify';
 
const BudgetRevenueChart = ({ budget, revenue, height = 140 }) => {
    const data = [
        { name: 'Budget', value: budget, fill: '#FB7185' },
        { name: 'Revenue', value: revenue, fill: '#639922' },
    ];
    return (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 8, right: 40, left: 8, bottom: 8 }}
            >
                <XAxis type="number" hide domain={[0, 'dataMax']} />
                <YAxis type="category" dataKey="name" width={70} tickLine={false} axisLine={false} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={28}>
                    {data.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                    ))}
                    <LabelList dataKey="value" position="right" formatter={(v) => millify(v)}/>
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    )
}
 
export default BudgetRevenueChart;