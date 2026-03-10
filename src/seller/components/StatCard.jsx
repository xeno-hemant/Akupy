import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatCard({ title, value, subtext, trend, trendValue, icon: Icon, accentColor = '#22C55E', loading = false }) {
    const trendColor = trend === 'up' ? '#22C55E' : trend === 'down' ? '#EF4444' : '#94A3B8';
    const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

    if (loading) {
        return (
            <div className="rounded-xl p-5 animate-pulse" style={{ background: '#fff', border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                <div className="flex justify-between items-start mb-4">
                    <div className="h-3 w-24 rounded-full bg-slate-200" />
                    <div className="w-10 h-10 rounded-xl bg-slate-200" />
                </div>
                <div className="h-8 w-32 rounded-lg bg-slate-200 mb-2" />
                <div className="h-3 w-40 rounded-full bg-slate-200" />
            </div>
        );
    }

    return (
        <div
            className="rounded-xl p-5 transition-all duration-200"
            style={{
                background: '#fff',
                border: '1px solid #F1F5F9',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
            <div className="flex items-start justify-between mb-4">
                <p className="text-sm font-semibold" style={{ color: '#64748B' }}>{title}</p>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${accentColor}18`, color: accentColor }}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>

            <div className="mb-2">
                <span className="text-2xl md:text-3xl font-black" style={{ color: '#0F172A' }}>{value}</span>
            </div>

            {(subtext || trendValue) && (
                <div className="flex items-center gap-2">
                    {trendValue && (
                        <div className="flex items-center gap-1">
                            <TrendIcon className="w-3.5 h-3.5" style={{ color: trendColor }} />
                            <span className="text-xs font-bold" style={{ color: trendColor }}>{trendValue}</span>
                        </div>
                    )}
                    {subtext && (
                        <span className="text-xs font-medium" style={{ color: '#94A3B8' }}>{subtext}</span>
                    )}
                </div>
            )}

            {/* Bottom accent bar */}
            <div className="mt-4 h-1 rounded-full" style={{ background: `${accentColor}20` }}>
                <div className="h-full rounded-full" style={{ background: accentColor, width: '40%' }} />
            </div>
        </div>
    );
}
