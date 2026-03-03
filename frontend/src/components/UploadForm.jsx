import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BrainCircuit,
    Upload,
    FileText,
    Sparkles,
    CheckCircle,
    XCircle,
    Loader2,
    Search,
    Zap
} from "lucide-react";

const UploadForm = ({ onAnalyze, isLoading }) => {
    const [file, setFile] = useState(null);
    const [jd, setJd] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (file && jd) onAnalyze(file, jd);
    };

    return (
        <div className="max-w-4xl mx-auto -mt-32 px-6 pb-20">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="glass p-1 rounded-3xl overflow-hidden shadow-2xl"
            >
                <div className="p-8 md:p-12">
                    <form onSubmit={handleSubmit} className="space-y-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            {/* File Section */}
                            <div className="space-y-4">
                                <label className="flex items-center text-sm font-black text-slate-400 uppercase tracking-widest">
                                    <Zap className="w-4 h-4 mr-2 text-primary-500 fill-primary-500" />
                                    Engine Core Input / Resume
                                </label>
                                <div
                                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        setIsDragging(false);
                                        if (e.dataTransfer.files && e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
                                    }}
                                    className={`h-[300px] relative cursor-pointer border-2 border-dashed rounded-2xl transition-all duration-300 flex flex-col items-center justify-center p-8 text-center ${isDragging
                                        ? 'border-primary-500 bg-primary-50/50 scale-[1.02]'
                                        : 'border-slate-200 hover:border-primary-400 hover:bg-slate-50/50'
                                        }`}
                                >
                                    <input
                                        type="file"
                                        onChange={(e) => setFile(e.target.files[0])}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        accept=".pdf,.docx"
                                    />
                                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all ${file ? 'bg-primary-500 text-white rotate-6' : 'bg-slate-100 text-slate-400'
                                        }`}>
                                        {file ? <FileText className="w-10 h-10" /> : <Upload className="w-10 h-10" />}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-800 mb-2">
                                            {file ? file.name : 'Drop Resume'}
                                        </h3>
                                        <p className="text-slate-400 font-medium">Standard PDF or DOCX</p>
                                        {file && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="mt-4 flex items-center justify-center text-emerald-500 font-bold text-sm"
                                            >
                                                <CheckCircle className="w-4 h-4 mr-1.5" /> File Secured
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* JD Section */}
                            <div className="space-y-4">
                                <label className="flex items-center text-sm font-black text-slate-400 uppercase tracking-widest">
                                    <Search className="w-4 h-4 mr-2 text-primary-500" />
                                    Context / Job Description
                                </label>
                                <div className="h-[300px] relative">
                                    <textarea
                                        value={jd}
                                        onChange={(e) => setJd(e.target.value)}
                                        placeholder="Provide the target job description to match against..."
                                        className="w-full h-full p-6 pb-20 rounded-2xl glass border border-slate-200 focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all resize-none text-slate-600 font-medium placeholder:text-slate-300"
                                    ></textarea>
                                    <div className="absolute bottom-4 right-4 pointer-events-none opacity-20">
                                        <BrainCircuit className="w-12 h-12" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <motion.button
                            type="submit"
                            disabled={!file || !jd || isLoading}
                            whileHover={!file || !jd || isLoading ? {} : { scale: 1.01, filter: "brightness(1.1)" }}
                            whileTap={!file || !jd || isLoading ? {} : { scale: 0.99 }}
                            className={`w-full py-6 rounded-2xl font-black text-xl tracking-wide shadow-2xl transition-all flex items-center justify-center space-x-3 text-white ${!file || !jd || isLoading
                                ? 'bg-slate-300 cursor-not-allowed grayscale'
                                : 'bg-gradient-to-r from-primary-600 to-indigo-600 animate-pulse-slow'
                                }`}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    <span>Analyzing with AI Engine...</span>
                                </>
                            ) : (
                                <>
                                    <span>Initialize AI Evaluation</span>
                                    <Zap className="w-5 h-5 fill-white" />
                                </>
                            )}
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default UploadForm;
