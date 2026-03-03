import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UploadForm from './components/UploadForm';
import ResultsDashboard from './components/ResultsDashboard';
import { analyzeResume } from './api';
import { Sparkles, BrainCircuit, Globe, Github } from 'lucide-react';

function App() {
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleAnalyze = async (file, jd) => {
        setLoading(true);
        setError(null);
        try {
            const data = await analyzeResume(file, jd);
            setResults(data);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || "System Engine Failure: Communication with AI service interrupted.");
        } finally {
            setLoading(false);
        }
    };

    const resetAll = () => {
        setResults(null);
        setError(null);
    };

    return (
        <div className="min-h-screen bg-[#f1f5f9] selection:bg-primary-500 selection:text-white">
            {/* Background patterns */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-200 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200 blur-[120px] rounded-full" />
            </div>

            {/* Nav */}
            <nav className="relative z-50 px-8 py-6 h-20 flex items-center justify-between max-w-7xl mx-auto">
                <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <BrainCircuit className="w-6 h-6" />
                    </div>
                    <span className="text-xl font-black tracking-tighter text-slate-800">RESUME.AI</span>
                </div>
                <div className="hidden md:flex items-center space-x-8 text-sm font-black text-slate-400 uppercase tracking-widest">
                    {/* <a href="#" className="hover:text-primary-600 transition-colors">Documentation</a>
                    <a href="#" className="hover:text-primary-600 transition-colors">Capabilities</a> */}
                    <a href="https://github.com/Kaifkhan1212/MindBrief-Ai-Summarization" className="flex items-center px-5 py-2.5 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-800 hover:shadow-md transition-all">
                        <Github className="w-4 h-4 mr-2" />
                        Source
                    </a>
                </div>
            </nav>

            <div className="relative">
                <AnimatePresence mode="wait">
                    {!results ? (
                        <motion.div
                            key="landing"
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <header className="gradient-hero pt-32 pb-52 px-6 text-white text-center overflow-hidden relative">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 1 }}
                                    className="absolute inset-0 overflow-hidden"
                                >
                                    <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float" />
                                    <div className="absolute bottom-40 right-40 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
                                </motion.div>

                                <div className="max-w-4xl mx-auto relative z-10">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="inline-flex items-center space-x-3 px-5 py-2 rounded-full bg-white/10 backdrop-blur-2xl mb-8 border border-white/20 shadow-2xl"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                                        <span className="text-xs font-black tracking-[0.2em] uppercase text-sky-100">AI Intelligence Core v2.5</span>
                                    </motion.div>

                                    <motion.h1
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-6xl md:text-8xl font-black mb-6 tracking-tight leading-tight poppins"
                                    >
                                        Precision Resume <br />
                                        <span className="text-sky-300">Analytics.</span>
                                    </motion.h1>

                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-sky-100/80 text-xl md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed"
                                    >
                                        Deploy Gemini 2.5 Flash neural models to decode matching scores,
                                        detect AI generation, and receive strategic career feedback.
                                    </motion.p>
                                </div>
                            </header>

                            <UploadForm onAnalyze={handleAnalyze} isLoading={loading} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="pt-10"
                        >
                            <ResultsDashboard data={results} onReset={resetAll} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Modern Footer */}
            {/* <footer className="relative z-10 border-t border-slate-200 mt-20 pt-16 pb-12 bg-white">
                <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-6">
                            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white">
                                <BrainCircuit className="w-5 h-5" />
                            </div>
                            <span className="text-lg font-black tracking-tighter text-slate-800">RESUME.AI</span>
                        </div>
                        <p className="text-slate-500 font-medium max-w-sm leading-relaxed mb-6">
                            Engineering the future of recruitment through advanced Large Language Models and semantic matching algorithms.
                        </p>
                        <div className="flex space-x-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary-600 transition-colors cursor-pointer">
                                <Globe className="w-5 h-5" />
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary-600 transition-colors cursor-pointer">
                                <Github className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-black text-slate-800 mb-6 uppercase text-xs tracking-widest">Platform</h4>
                        <ul className="space-y-4 text-slate-500 font-bold text-sm">
                            <li><a href="#" className="hover:text-primary-600">API Documentation</a></li>
                            <li><a href="#" className="hover:text-primary-600">Model Specifications</a></li>
                            <li><a href="#" className="hover:text-primary-600">Privacy Protocol</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-black text-slate-800 mb-6 uppercase text-xs tracking-widest">Academic</h4>
                        <p className="text-slate-500 font-bold text-sm leading-relaxed">
                            Designed and built for MCA Final Year Project Presentation • 2026
                        </p>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-8 mt-16 pt-8 border-t border-slate-100 text-center">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                        System Status: All Neural Modules Operational
                    </p>
                </div>
            </footer> */}
        </div>
    );
}

export default App;
