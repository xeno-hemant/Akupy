import React, { useEffect, useState } from 'react';
import useTryOnStore from '../../store/useTryOnStore';
import { Sparkles, Shirt, Plus } from 'lucide-react';

export default function AIStylistPanel({ product }) {
    const { bodyProfile } = useTryOnStore();
    const [styling, setStyling] = useState(null);

    useEffect(() => {
        // Simulate AI stylist API call
        setTimeout(() => {
            const type = product.garmentType || 'top';
            const shape = bodyProfile?.bodyShape || 'Undefined';

            let recoText = "This piece complements your skin tone perfectly. The cut offers a relaxed fit.";
            if (shape === 'Inverted Triangle' && type === 'top') {
                recoText = "The structured shoulders on this top might widen your upper body. Consider pairing with dark, flared pants to balance your silhouette.";
            } else if (shape === 'Hourglass' && type === 'dress') {
                recoText = "This piece accentuates your natural waistline. A thin belt would elevate the look even further.";
            } else if (shape === 'Rectangle') {
                recoText = "This cut adds great dimension. We recommend tucking it in to create a stronger waist shape.";
            }

            setStyling({
                recommendation: recoText,
                pairingSuggestion: type === 'top' ? 'High-Waisted Wide Leg Trousers' : 'Fitted Mock Neck Sweater',
                score: 9.2
            });
        }, 1800);
    }, [product, bodyProfile]);

    return (
        <div className="bg-gradient-to-br from-white/5 to-transparent border rounded-3xl p-6 relative group overflow-hidden mt-4" style={{ borderColor: 'rgba(142,134,123,0.3)' }}>

            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-heading font-black text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#ffd700]" />
                    AI Stylist
                </h3>
                {styling && (
                    <span className="text-sm font-bold bg-white/10 text-white px-3 py-1 rounded-full backdrop-blur-md">
                        Match: {styling.score}/10
                    </span>
                )}
            </div>

            {!styling ? (
                <div className="space-y-4 py-4">
                    <div className="flex items-center gap-3 font-semibold animate-pulse text-sm" style={{ color: 'rgba(142,134,123,0.7)' }}>
                        <div className="w-4 h-4 rounded border-2 border-t-transparent animate-spin" style={{ borderColor: 'rgba(142,134,123,0.7)', borderTopColor: 'transparent' }}></div>
                        Analyzing body geometry & palette...
                    </div>
                    <div className="w-full h-16 bg-white/5 rounded-xl animate-pulse"></div>
                </div>
            ) : (
                <div className="space-y-5 animate-fade-in-up">
                    <p className="text-sm text-[#8b8ba0] leading-relaxed italic border-l-2 pl-4" style={{ borderColor: '#8E867B' }}>
                        "{styling.recommendation}"
                    </p>

                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                        <span className="block text-xs uppercase tracking-wider text-white/40 mb-3 font-bold">Complete The Look</span>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                    <Shirt className="w-5 h-5 text-[#8b8ba0]" />
                                </div>
                                <span className="text-sm font-semibold text-white/90">{styling.pairingSuggestion}</span>
                            </div>
                            <button className="w-8 h-8 rounded-full flex items-center justify-center transition-colors" style={{ background: 'rgba(142,134,123,0.1)', color: '#8E867B' }}>
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
