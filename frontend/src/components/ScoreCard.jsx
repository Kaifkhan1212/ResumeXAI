import React from 'react';

const ScoreCard = ({ title, value, type, suffix = "%", label = "" }) => {
    const getColors = () => {
        if (type === 'ai') {
            if (value < 30) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
            if (value < 70) return 'text-amber-600 bg-amber-50 border-amber-100';
            return 'text-rose-600 bg-rose-50 border-rose-100';
        }
        return 'text-slate-700 bg-slate-50 border-slate-100';
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</span>

            <div className="relative flex items-center justify-center">
                {type === 'circular' ? (
                    <div className="w-24 h-24 rounded-full border-8 border-slate-50 flex items-center justify-center relative overflow-hidden">
                        <div
                            className="absolute inset-0 border-8 border-primary-500 rounded-full transition-all duration-1000"
                            style={{ clipPath: `inset(${100 - value}% 0 0 0)` }}
                        ></div>
                        <span className="text-2xl font-black text-slate-800 z-10">{value}{suffix}</span>
                    </div>
                ) : (
                    <div className="text-4xl font-black text-slate-800">{value}{suffix}</div>
                )}
            </div>

            {label && (
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getColors()}`}>
                    {label}
                </span>
            )}
        </div>
    );
};

export default ScoreCard;
