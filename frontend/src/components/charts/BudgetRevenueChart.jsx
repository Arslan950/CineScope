import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Cell, LabelList, ResponsiveContainer } from "recharts";
import { useThemeStore } from '../../store/ThemeStore';
import millify from 'millify';

const CustomLabel = (props) => {
    const { x, y, width, height, value, fill } = props;
    return (
        <text
            x={x + width + 4}
            y={y + height / 2}
            fill={fill}
            dy={5}
            fontSize={18}
            textAnchor="start"
        >
            {`$${millify(value)}`}
        </text>
    );
};

const CustomYAxisTick = ({ x, y, payload }) => {
    const theme = useThemeStore((state) => state.theme);
    const textColor = theme === 'dark' ? '#ffffff' : '#28282B';
    return (
        <text
            x={0}
            y={y}
            dy={5}
            fill={textColor}
            fontSize={14}
            fontWeight={600}
            textAnchor="start"
        >
            {payload.value}
        </text>
    );
};


const BudgetRevenueChart = ({ budget, revenue, height = 160 }) => {
    let data = [];

    if (budget !== "Not specified") {
        data = [{ name: 'Budget', value: budget, fill: '#F2545B' },]
    }

    if (revenue !== "Not specified") {
        data = [...data, { name: 'Revenue', value: revenue, fill: ' #06D6A0' }]
    }

    return (
        <div className="w-full hover:scale-105 duration-300 h-56">
            <ResponsiveContainer width="100%" height={height}>
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 50, right: 97, left: 0, bottom: 0 }}
                    barCategoryGap="25%"
                >
                    <XAxis type="number" hide domain={[0, 'dataMax']} />

                    <YAxis
                        type="category"
                        dataKey="name"
                        width={75}
                        tickLine={false}
                        axisLine={false}
                        tick={<CustomYAxisTick />}
                    />

                    <Bar
                        dataKey="value"
                        radius={[0, 6, 6, 0]}
                        barSize={40}
                        activeBar={false}
                    >
                        {data.map((entry) => (
                            <Cell
                                key={entry.name}
                                fill={entry.fill}
                            />
                        ))}
                        <LabelList content={<CustomLabel />} />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default BudgetRevenueChart;