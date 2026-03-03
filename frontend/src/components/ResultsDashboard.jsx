import React from 'react';
import { motion } from 'framer-motion';
import MetricCard from './MetricCard';
import SkillTags from './SkillTags';
import SuggestionsPanel from './SuggestionsPanel';
import AIContext from './AIContext';
import { ArrowLeft, Download, ShieldCheck, Sparkles } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ResultsDashboard = ({ data, onReset }) => {
    const exportPDF = () => {
        const input = document.getElementById('report-content');
        html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`AI_Resume_Analysis_${new Date().getTime()}.pdf`);
        });
    };

    return (
        <div className="max-w-6xl mx-auto px-6 pb-24 animate-in fade-in duration-1000">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <button
                        onClick={onReset}
                        className="group flex items-center text-slate-500 hover:text-primary-600 font-bold transition-all mb-4 text-sm uppercase tracking-widest"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        New Evaluation
                    </button>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight flex items-center">
                        Verification Report <ShieldCheck className="ml-3 w-8 h-8 text-emerald-500" />
                    </h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex space-x-3"
                >
                    <button
                        onClick={exportPDF}
                        className="flex items-center px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-2xl hover:bg-slate-800 active:scale-95 transition-all"
                    >
                        <Download className="w-4 h-4 mr-3" />
                        Export Intelligence
                    </button>
                </motion.div>
            </div>

            <div id="report-content" className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <MetricCard
                        title="Competency Match"
                        value={data.match_score}
                        type="circular"
                        index={0}
                    />
                    <MetricCard
                        title="Selection Probability"
                        value={data.selection_probability}
                        type="standard"
                        suffix="%"
                        index={1}
                    />
                    <MetricCard
                        title="AI Content Detection"
                        value={data.ai_generated_probability}
                        type="ai"
                        label={data.confidence_level}
                        suffix="%"
                        index={2}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-8">
                        <SkillTags title="Matched Competencies" skills={data.matched_skills} type="matched" index={0} />
                        <SkillTags title="Identified Skill Gaps" skills={data.missing_skills} type="missing" index={1} />
                        <AIContext reasoning={data.ai_reasoning} />
                    </div>

                    <div className="space-y-8">
                        <SuggestionsPanel
                            suggestions={data.improvement_suggestions}
                            feedback={data.overall_feedback}
                        />
                    </div>
                </div>

                <div className="glass p-6 rounded-2xl border-dashed border-2 border-slate-200">
                    <div className="flex items-start space-x-4">
                        <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-black text-slate-800 mb-1">Expert Summary</h4>
                            <p className="text-slate-500 font-medium text-sm leading-relaxed">
                                {data.summary}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultsDashboard;
