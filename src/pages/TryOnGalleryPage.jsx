import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useTryOnStore from '../store/useTryOnStore';
import useAuthStore from '../store/useAuthStore';
import VirtualTryOnCanvas from '../components/tryon/VirtualTryOnCanvas';
import { Share2, Tag, Shirt, Trash2, ArrowLeft } from 'lucide-react';

export default function TryOnGalleryPage() {
    const { user } = useAuthStore();
    const { bodyProfile, fetchProfile } = useTryOnStore();
    const [loading, setLoading] = useState(true);

    // Mocked wardrobe items since backend doesn't populate nested embedded commerce products yet
    const [wardrobe, setWardrobe] = useState([
        { id: 1, name: "Midnight Linen Top", type: "top", color: "#2A2A35", date: "2 mins ago" },
        { id: 2, name: "Desert Sand Chinos", type: "bottom", color: "#d0a781", date: "1 hr ago" },
        { id: 3, name: "Crimson Evening Kurta", type: "dress", color: "#8B0000", date: "2 days ago" }
    ]);

    useEffect(() => {
        if (user) {
            fetchProfile(user.token).finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [user]);

    if (!user) {
        return (
            <div className="min-h-screen pt-32 px-6 flex flex-col items-center text-center">
                <h1 className="text-4xl font-heading font-black text-white mb-6">Virtual Wardrobe</h1>
                <p className="text-[#8b8ba0] max-w-md">Please sign in to access your saved outfits and 3D body clone.</p>
                <Link to="/" className="mt-8 px-8 py-3 font-bold rounded-full" style={{ background: '#8E867B', color: '#F3F0E2' }}>Go to Sign In</Link>
            </div>
        );
    }

    if (loading) {
        return <div className="min-h-screen pt-32 text-center text-[#8b8ba0] animate-pulse">Loading Your Closet...</div>;
    }

    return (
        <div className="min-h-screen pt-24 pb-20 px-6 md:px-12 xl:px-24">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-8">
                    <div>
                        <Link to="/discover" className="inline-flex items-center gap-2 text-sm text-[#8b8ba0] hover:text-white mb-4 transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Back to Shopping
                        </Link>
                        <h1 className="text-4xl md:text-6xl font-heading font-black text-white tracking-tight flex items-center gap-4">
                            Try-On Gallery <span className="text-3xl">👗</span>
                        </h1>
                        <p className="text-[#8b8ba0] mt-3 max-w-xl text-lg">
                            Review saved combinations, analyze fit, and manage your 3D digital clone.
                        </p>
                    </div>
                    <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-white font-semibold flex items-center gap-2 hover:bg-white/10 transition">
                        <Share2 className="w-5 h-5" style={{ color: '#8E867B' }} /> Share My Avatar
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Avatar Panel */}
                    <div className="lg:col-span-5 h-[600px] border border-white/10 rounded-3xl overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                        {bodyProfile ? (
                            <VirtualTryOnCanvas />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/5 text-center p-8 border-2 border-dashed border-white/20 rounded-3xl m-4">
                                <Shirt className="w-16 h-16 text-[#8b8ba0] mb-6 opacity-30" />
                                <h3 className="text-2xl font-bold text-white mb-2">No Avatar Found</h3>
                                <p className="text-[#8b8ba0] mb-8">You haven't completed the 3D body scan or manual setup yet.</p>
                                <Link to="/discover" className="px-8 py-4 font-bold rounded-xl active:scale-95 shadow-[0_0_20px_rgba(142,134,123,0.2)]" style={{ background: '#8E867B', color: '#F3F0E2' }}>
                                    Browse Clothes to Try
                                </Link>
                            </div>
                        )}

                        {bodyProfile && (
                            <div className="absolute top-6 left-6 right-6 flex justify-between pointer-events-none">
                                <div className="bg-black/40 backdrop-blur-md px-4 py-2 border border-white/10 rounded-full">
                                    <span className="text-white text-sm font-bold opacity-80 uppercase tracking-widest">Idle Model</span>
                                </div>
                                <div className="backdrop-blur-md px-4 py-2 border rounded-full shadow-[0_0_15px_rgba(142,134,123,0.1)]" style={{ background: 'rgba(142,134,123,0.1)', borderColor: 'rgba(142,134,123,0.3)' }}>
                                    <span className="text-sm font-bold flex items-center gap-2" style={{ color: '#8E867B' }}>
                                        <div className="w-2 h-2 rounded-full animate-ping" style={{ background: '#8E867B' }}></div>
                                        Synced
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Details Panel */}
                    <div className="lg:col-span-7 space-y-10">

                        {/* Body Metrics Summary */}
                        {bodyProfile && (
                            <section>
                                <h2 className="text-2xl font-heading font-bold text-white mb-6">Your Metrics</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-center">
                                        <span className="text-[#8b8ba0] text-xs uppercase font-bold tracking-wider mb-1">Height</span>
                                        <span className="text-2xl font-black text-white">{bodyProfile.height} <span className="text-sm font-medium text-white/40">cm</span></span>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-center">
                                        <span className="text-[#8b8ba0] text-xs uppercase font-bold tracking-wider mb-1">Weight</span>
                                        <span className="text-2xl font-black text-white">{bodyProfile.weight} <span className="text-sm font-medium text-white/40">kg</span></span>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-center">
                                        <span className="text-[#8b8ba0] text-xs uppercase font-bold tracking-wider mb-1">Body Shape</span>
                                        <span className="text-xl font-bold line-clamp-1" style={{ color: '#8E867B' }}>{bodyProfile.bodyShape}</span>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-center">
                                        <span className="text-[#8b8ba0] text-xs uppercase font-bold tracking-wider mb-1">Generated Via</span>
                                        <span className="text-sm font-bold text-white capitalize">{bodyProfile.measurementSource} Scan</span>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Recent Outfits */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-heading font-bold text-white">Saved Looks</h2>
                                <span className="text-sm font-bold text-[#8b8ba0] bg-white/5 px-3 py-1 rounded-full">{wardrobe.length} Items</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {wardrobe.map((item) => (
                                    <div key={item.id} className="group bg-white/[0.03] hover:bg-white/[0.08] transition-colors border border-white/10 rounded-3xl p-5 relative overflow-hidden flex flex-col h-[200px]">

                                        {/* Mock Icon Graphic */}
                                        <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-20 bg-gradient-to-br from-white/20 to-transparent flex items-center justify-center">
                                            <Shirt className="w-12 h-12 text-white" />
                                        </div>

                                        <div className="flex justify-between items-start mb-auto relative z-10">
                                            <div className="p-2.5 rounded-xl border border-white/10 shadow-inner" style={{ backgroundColor: item.color }}></div>
                                            <button className="text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="relative z-10">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md" style={{ background: 'rgba(142,134,123,0.1)', color: '#8E867B' }}>
                                                    {item.type}
                                                </span>
                                                <span className="text-[#8b8ba0] text-xs flex items-center gap-1">
                                                    <Tag className="w-3 h-3" /> {item.date}
                                                </span>
                                            </div>
                                            <h4 className="text-white font-bold leading-snug line-clamp-2">{item.name}</h4>
                                        </div>

                                    </div>
                                ))}

                                {/* Empty Add Slot */}
                                <Link to="/discover" className="border-2 border-dashed border-white/10 hover:border-white/30 rounded-3xl p-5 flex flex-col items-center justify-center h-[200px] transition-colors text-[#8b8ba0] hover:text-white group">
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <span className="text-2xl">+</span>
                                    </div>
                                    <span className="font-semibold text-sm">Find more styles</span>
                                </Link>
                            </div>
                        </section>

                    </div>

                </div>

            </div>
        </div>
    );
}
