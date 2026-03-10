import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Sparkles, Clock, Truck, RotateCcw, MessageCircle, Tag } from 'lucide-react';

const SLIDES = [
    {
        id: 'new-shops',
        label: 'New Arrivals 🎉',
        title: 'New Shops Just Joined Your City',
        desc: 'Discover 50+ trusted local businesses near you',
        btnText: 'Explore Now',
        btnLink: '/discover',
        bg: '#E8E0D6',
        labelColor: '#8E867B',
        titleColor: '#3d3830',
        descColor: '#8E867B',
        btnBg: '#8E867B',
        btnText2: '#F3F0E2',
    },
    {
        id: 'flash-sale',
        label: '⚡ Limited Time',
        title: 'Flash Sale — Up to 70% Off',
        desc: 'Grab the best deals before time runs out',
        btnText: 'Shop Now',
        btnLink: '/discover?discount=50',
        bg: '#3d3830',
        labelColor: '#b5776e',
        titleColor: '#F3F0E2',
        descColor: '#D9D5D2',
        btnBg: '#F0EADD',
        btnText2: '#3d3830',
        timer: true,
    },
    {
        id: 'globe-shop',
        label: '🌍 Global',
        title: 'Globe Shop is Live Worldwide',
        desc: 'Access international stores with local payment ease',
        btnText: 'Explore Global',
        btnLink: '/discover?globeShop=true',
        bg: '#8E867B',
        labelColor: '#F3F0E2',
        titleColor: '#F3F0E2',
        descColor: '#E8E0D6',
        btnBg: '#F3F0E2',
        btnText2: '#3d3830',
    },
    {
        id: 'try-on',
        label: '👗 Virtual Fitting',
        title: 'Try Before You Buy',
        desc: 'See how it fits your 3D digital clone — free for all users',
        btnText: 'Try Now Free',
        btnLink: '/wardrobe',
        bg: '#F0EADD',
        labelColor: '#8E867B',
        titleColor: '#3d3830',
        descColor: '#8E867B',
        btnBg: '#8E867B',
        btnText2: '#F3F0E2',
    }
];

const OFFERS = [
    { icon: Truck, text: "Free Delivery", sub: "Orders over ₹499" },
    { icon: RotateCcw, text: "Easy Returns", sub: "7-day policy" },
    { icon: MessageCircle, text: "24/7 Support", sub: "Always here" },
    { icon: Tag, text: "Best Prices", sub: "Guaranteed" },
];

export default function HeroBanner() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
        }, 4800);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const end = new Date();
            end.setHours(23, 59, 59);
            const diff = end - now;
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            setTimeLeft(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const slide = SLIDES[currentSlide];

    return (
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 pt-4 pb-8">

            {/* Main Banner */}
            <div
                className="relative w-full h-[280px] md:h-[360px] lg:h-[440px] rounded-2xl overflow-hidden transition-all duration-700"
                style={{ boxShadow: '0 4px 24px rgba(142,134,123,0.18)' }}
            >
                {SLIDES.map((s, idx) => (
                    <div
                        key={s.id}
                        className={`absolute inset-0 transition-opacity duration-1000 flex flex-col justify-center p-8 md:p-16 ${currentSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                        style={{ background: s.bg }}
                    >
                        <div className="max-w-2xl animate-fade-in-up">
                            <span
                                className="inline-block mb-3 text-sm font-bold uppercase tracking-[0.12em]"
                                style={{ color: s.labelColor }}
                            >
                                {s.label}
                            </span>
                            <h2
                                className="text-3xl md:text-5xl lg:text-6xl font-heading font-black leading-tight mb-4"
                                style={{ color: s.titleColor }}
                            >
                                {s.title}
                            </h2>
                            <p
                                className="text-lg md:text-xl mb-8 max-w-lg font-medium"
                                style={{ color: s.descColor }}
                            >
                                {s.desc}
                            </p>

                            <div className="flex items-center gap-4 flex-wrap">
                                <Link
                                    to={s.btnLink}
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold hover:opacity-90 transition-all active:scale-95 shadow-sm"
                                    style={{ background: s.btnBg, color: s.btnText2 }}
                                >
                                    {s.btnText} <ArrowRight className="w-4 h-4" />
                                </Link>

                                {s.timer && timeLeft && (
                                    <div
                                        className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-full font-mono font-bold tracking-widest text-lg"
                                        style={{ background: 'rgba(61,56,48,0.6)', color: '#F3F0E2', border: '1px solid rgba(213,119,110,0.4)' }}
                                    >
                                        <Clock className="w-5 h-5 animate-pulse" style={{ color: '#b5776e' }} />
                                        {timeLeft}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Decorative elements */}
                        {s.id === 'globe-shop' && (
                            <Globe className="absolute -right-20 -bottom-20 w-96 h-96 opacity-10 animate-[spin_60s_linear_infinite]" style={{ color: '#F3F0E2' }} />
                        )}
                        {s.id === 'try-on' && (
                            <Sparkles className="absolute right-10 top-10 w-32 h-32 opacity-20 animate-pulse" style={{ color: '#8E867B' }} />
                        )}
                        {s.id === 'new-shops' && (
                            <div
                                className="absolute right-12 bottom-8 w-32 h-32 rounded-full opacity-20"
                                style={{ background: 'radial-gradient(circle, #8E867B, transparent)' }}
                            ></div>
                        )}
                    </div>
                ))}

                {/* Carousel Indicators */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
                    {SLIDES.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className="h-1.5 rounded-full transition-all duration-500"
                            style={{
                                width: currentSlide === idx ? '2rem' : '0.5rem',
                                background: currentSlide === idx ? '#8E867B' : '#D9D5D2',
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Offer Cards */}
            <div className="mt-6 w-full overflow-x-auto hide-scrollbar pb-2">
                <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 min-w-[600px] sm:min-w-0">
                    {OFFERS.map((offer, idx) => {
                        const Icon = offer.icon;
                        return (
                            <div
                                key={idx}
                                className="flex-1 flex items-center gap-4 rounded-xl p-4 cursor-pointer transition-all group"
                                style={{
                                    background: '#F0EADD',
                                    border: '1px solid #D9D5D2',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#E8E0D6'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(142,134,123,0.16)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = '#F0EADD'; e.currentTarget.style.boxShadow = 'none'; }}
                            >
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
                                    style={{ background: '#E8E0D6' }}
                                >
                                    <Icon className="w-5 h-5" style={{ color: '#8E867B' }} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm" style={{ color: '#3d3830' }}>{offer.text}</h4>
                                    <span className="text-xs font-semibold" style={{ color: '#8E867B' }}>{offer.sub}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
    );
}
