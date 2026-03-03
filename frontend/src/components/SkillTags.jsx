import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';

const SkillTags = ({ title, skills, type, index }) => {
    const isMatched = type === 'matched';

    return (
        <motion.div
            initial={{ opacity: 0, x: isMatched ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
            className="glass p-6 rounded-2xl shadow-lg border-white/50"
        >
            <div className="flex items-center space-x-3 mb-5">
                <div className={`p-2 rounded-lg ${isMatched ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                    {isMatched ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                </div>
                <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
            </div>

            <div className="flex flex-wrap gap-2.5">
                {skills.map((skill, i) => (
                    <motion.span
                        key={i}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.4 + (i * 0.05) }}
                        whileHover={{ scale: 1.05 }}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${isMatched
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100'
                                : 'bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100'
                            }`}
                    >
                        {skill}
                    </motion.span>
                ))}
            </div>
        </motion.div>
    );
};

export default SkillTags;
