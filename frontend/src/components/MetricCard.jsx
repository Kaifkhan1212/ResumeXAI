import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const MetricCard = ({ title, value, type, suffix = "%", label = "", index = 0 }) => {
    const isAI = type === 'ai';

    const getBadgeColor = () => {
        if (!isAI) return 'text-slate-600 bg-slate-100 border-slate-200';
        if (value < 30) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
        if (value < 70) return 'text-amber-600 bg-amber-50 border-amber-100';
        return 'text-rose-600 bg-rose-50 border-rose-100';
    };

    const chartData = [
        { name: 'Value', value: value },
        { name: 'Remaining', value: 100 - value },
    ];

    const getChartColor = () => {
        if (isAI) {
            if (value < 30) return '#10b981';
            if (value < 70) return '#f59e0b';
            return '#ef4444';
        }
        return '#3b82f6';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -5 }}
            className="glass p-6 rounded-2xl shadow-xl shadow-slate-200/50 flex flex-col items-center text-center space-y-4"
        >
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">{title}</span>

            <div className="w-24 h-24 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={40}
                            startAngle={90}
                            endAngle={450}
                            paddingAngle={0}
                            dataKey="value"
                            stroke="none"
                            animationBegin={index * 200}
                            animationDuration={1500}
                        >
                            <Cell fill={getChartColor()} />
                            <Cell fill="#e2e8f0" />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center font-black text-xl text-slate-800">
                    {value}{suffix}
                </div>
            </div>

            {label && (
                <motion.span
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getBadgeColor()}`}
                >
                    {label}
                </motion.span>
            )}
        </motion.div>
    );
};

export default MetricCard;
