import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../config/apiRoutes';
import api from '../utils/apiHelper';

const CATEGORY_UI = {
    Fashion: { icon: '👗' },
    Electronics: { icon: '📱' },
    Food: { icon: '🍕' },
    Beauty: { icon: '💄' },
    Furniture: { icon: '🪑' },
    Books: { icon: '📚' },
    Gaming: { icon: '🎮' },
    Fitness: { icon: '🏋️' },
    Health: { icon: '💊' },
    Pets: { icon: '🐾' },
    Services: { icon: '🛠️' },
    Home: { icon: '🏠' },
};

export default function CategoryGrid() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(API.CATEGORIES)
            .then(res => {
                const data = res.data;
                if (!data || data.length === 0) {
                    setCategories(Object.keys(CATEGORY_UI).map(name => ({ name, count: Math.floor(Math.random() * 500) + 10 })));
                } else {
                    setCategories(data);
                }
            })
            .catch(() => {
                setCategories(Object.keys(CATEGORY_UI).map(name => ({ name, count: Math.floor(Math.random() * 500) + 10 })));
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <section className="w-full max-w-[1400px] mx-auto px-4 md:px-6 py-12">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-heading font-bold" style={{ color: '#3d3830' }}>
                    Browse by Category
                </h2>
            </div>

            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-6">
                {loading
                    ? Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="flex flex-col items-center gap-3 animate-pulse">
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full" style={{ background: '#E8E0D6' }}></div>
                            <div className="w-12 h-3 rounded-full" style={{ background: '#E8E0D6' }}></div>
                        </div>
                    ))
                    : categories.map((cat, idx) => {
                        const ui = CATEGORY_UI[cat.name] || { icon: '📦' };
                        return (
                            <Link
                                key={idx}
                                to={`/discover?category=${encodeURIComponent(cat.name)}`}
                                className="flex flex-col items-center gap-3 group"
                            >
                                <div
                                    className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-3xl md:text-4xl shadow-sm transition-all group-hover:scale-110 group-active:scale-95"
                                    style={{ background: '#E8E0D6', border: '1.5px solid #D9D5D2' }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#D9D5D2'}
                                    onMouseLeave={e => e.currentTarget.style.background = '#E8E0D6'}
                                >
                                    {ui.icon}
                                </div>
                                <div className="text-center">
                                    <span className="block text-sm font-bold transition-colors" style={{ color: '#3d3830' }}>
                                        {cat.name}
                                    </span>
                                    <span className="text-[10px] md:text-xs font-semibold" style={{ color: '#aba49c' }}>
                                        {cat.count} items
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
            </div>
        </section>
    );
}
