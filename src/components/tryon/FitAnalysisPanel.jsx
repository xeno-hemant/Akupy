import React, { useEffect, useState } from 'react';
import useTryOnStore from '../../store/useTryOnStore';
import { Ruler, ShieldCheck } from 'lucide-react';

export default function FitAnalysisPanel({ product }) {
    const { bodyProfile } = useTryOnStore();
    const [analysis, setAnalysis] = useState(null);

    useEffect(() => {
        // Simulate complex API fit analysis computation
        setTimeout(() => {
            // Mock logic: randomly decide fit based on product fitType and user shape
            setAnalysis({
                chest: 'perfect',
                waist: 'loose',
                length: 'perfect',
                shoulders: 'perfect',
                recommendedSize: 'M',
                confidence: 94
            });
        }, 1200);
    }, [product, bodyProfile]);

    const StatusRow = ({ label, status }) => {
        let icon = '✅';
        let text = 'Perfect Fit';
        let color = '';

        if (status === 'loose') {
            icon = '⚠️'; text = 'Slightly Loose'; color = 'text-yellow-400';
        } else if (status === 'tight') {
            icon = '⚠️'; text = 'Slightly Tight'; color = 'text-orange-400';
        }

        // Default loading state
        if (!status) {
            return (
                <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                    <span className="text-[#8b8ba0]">{label}</span>
                    <div className="w-20 h-4 bg-white/10 rounded animate-pulse"></div>
                </div>
            );
        }

        return (
            <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                <span className="text-[#8b8ba0] font-medium">{label}</span>
                <span className={`font-bold flex items-center gap-2 ${color} text-sm`} style={color ? {} : { color: '#8E867B' }}>
                    {icon} {text}
                </span>
            </div>
        );
    };

    return (
        <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -mr-10 -mt-10 transition-colors" style={{ background: 'rgba(142,134,123,0.1)' }}></div>

            <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-heading font-black text-white flex items-center gap-2">
                    <Ruler className="w-5 h-5" style={{ color: '#8E867B' }} />
                    Fit Analysis
                </h3>
                {analysis && (
                    <div className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border" style={{ background: 'rgba(142,134,123,0.1)', color: '#8E867B', borderColor: 'rgba(142,134,123,0.2)' }}>
                        <ShieldCheck className="w-3 h-3" /> {analysis.confidence}% Match
                    </div>
                )}
            </div>

            <div className="bg-black/40 rounded-2xl p-4 mb-6 relative">
                <StatusRow label="Chest" status={analysis?.chest} />
                <StatusRow label="Waist" status={analysis?.waist} />
                <StatusRow label="Length" status={analysis?.length} />
                <StatusRow label="Shoulders" status={analysis?.shoulders} />

                {!analysis && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-2xl">
                        <span className="text-sm font-bold flex items-center gap-2" style={{ color: '#8E867B' }}>
                            <div className="w-3 h-3 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#8E867B', borderTopColor: 'transparent' }}></div>
                            Analyzing Mesh...
                        </span>
                    </div>
                )}
            </div>

            <div className="flex justify-between items-center border rounded-2xl p-4" style={{ background: 'rgba(142,134,123,0.1)', borderColor: 'rgba(142,134,123,0.2)' }}>
                <span className="text-white font-medium text-sm">Recommended Size</span>
                {analysis ? (
                    <span className="text-2xl font-black" style={{ color: '#8E867B' }}>{analysis.recommendedSize}</span>
                ) : (
                    <div className="w-8 h-8 bg-white/20 rounded animate-pulse"></div>
                )}
            </div>
        </div>
    );
}
