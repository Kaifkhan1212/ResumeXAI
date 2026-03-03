import React from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

const AIContext = ({ reasoning }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="glass-dark p-8 rounded-2xl shadow-2xl relative overflow-hidden"
        >
            <Brain className="absolute -right-8 -bottom-8 w-40 h-40 text-sky-500/10 -rotate-12 pointer-events-none" />
            <div className="relative z-10">
                <div className="flex items-center space-x-2 text-sky-400 mb-4">
                    <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-[0.2em]">Neural Engine Analysis</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-lg font-medium italic">
                    "{reasoning}"
                </p>
            </div>
        </motion.div>
    );
};

export default AIContext;
