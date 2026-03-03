import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, MessageCircle } from 'lucide-react';

const SuggestionsPanel = ({ suggestions, feedback }) => {
    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="glass p-8 rounded-2xl shadow-xl border-white/40"
            >
                <div className="flex items-center space-x-3 mb-8 text-primary-600">
                    <div className="p-2.5 bg-primary-100 rounded-xl">
                        <Lightbulb className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800">Growth Blueprint</h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {suggestions.map((suggestion, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + (i * 0.1) }}
                            className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-start space-x-3 hover:border-primary-200 hover:bg-white transition-all shadow-sm group"
                        >
                            <div className="mt-1 w-6 h-6 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 text-[10px] font-black group-hover:bg-primary-500 group-hover:text-white transition-colors">
                                {i + 1}
                            </div>
                            <p className="text-slate-600 font-medium leading-relaxed">{suggestion}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-gradient-to-br from-primary-600 to-indigo-700 p-8 rounded-2xl shadow-2xl text-white relative overflow-hidden group"
            >
                <MessageCircle className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 -rotate-12 pointer-events-none group-hover:scale-110 transition-transform" />
                <div className="relative z-10">
                    <div className="w-12 h-1 bg-white/30 rounded-full mb-6" />
                    <h3 className="text-xl font-black mb-3">Overall Evaluator Summary</h3>
                    <p className="text-primary-50 leading-relaxed text-lg font-medium">
                        "{feedback}"
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default SuggestionsPanel;
