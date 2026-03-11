import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useTryOnStore from '../store/useTryOnStore';
import useAuthStore from '../store/useAuthStore';
import VirtualTryOnCanvas from '../components/tryon/VirtualTryOnCanvas';
import { Share2, Tag, Shirt, Trash2, ArrowLeft } from 'lucide-react';

export default function TryOnGalleryPage() {
    const { user, token } = useAuthStore();
    const { bodyProfile, fetchProfile } = useTryOnStore();
    const [loading, setLoading] = useState(true);

    // Mocked wardrobe items since backend doesn't populate nested embedded commerce products yet
    const [wardrobe, setWardrobe] = useState([
        { id: 1, name: "Midnight Linen Top", type: "top", color: "#2A2A35", date: "2 mins ago" },
        { id: 2, name: "Desert Sand Chinos", type: "bottom", color: "#d0a781", date: "1 hr ago" },
        { id: 3, name: "Crimson Evening Kurta", type: "dress", color: "#8B0000", date: "2 days ago" }
    ]);

    useEffect(() => {
        if (token) {
            fetchProfile(token).finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [token]);

    if (!user) {
        return (
            <div className="min-h-screen pt-32 px-6 flex flex-col items-center text-center">
                <h1 className="text-4xl font-heading font-black text-[#3d3830] mb-6">Virtual Wardrobe</h1>
                <p className="text-[#8E867B] max-w-md">Please sign in to access your saved outfits and 3D body clone.</p>
                <Link to="/" className="mt-8 px-8 py-3 font-bold rounded-full" style={{ background: '#8E867B', color: '#F3F0E2' }}>Go to Sign In</Link>
            </div>
        );
    }

    if (loading) {
        return <div className="min-h-screen pt-32 text-center text-[#8E867B] animate-pulse">Loading Your Closet...</div>;
    }

    return (
        <div className="min-h-screen pt-24 pb-20 px-6 md:px-12 xl:px-24">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#D9D5D2] pb-8">
                    <div>
                        <Link to="/discover" className="inline-flex items-center gap-2 text-sm text-[#8E867B] hover:text-[#3d3830] mb-4 transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Back to Shopping
                        </Link>
                        <h1 className="text-4xl md:text-6xl font-heading font-black text-[#3d3830] tracking-tight flex items-center gap-4">
                            Try-On Gallery <span className="text-3xl">👗</span>
                        </h1>
                        <p className="text-[#8E867B] mt-3 max-w-xl text-lg">
                            Review saved combinations, analyze fit, and manage your 3D digital clone.
                        </p>
                    </div>
                    <button className="px-6 py-3 bg-[#E8E0D6] border border-[#D9D5D2] rounded-full text-[#3d3830] font-semibold flex items-center gap-2 hover:bg-[#D9D5D2] transition">
                        <Share2 className="w-5 h-5" style={{ color: '#8E867B' }} /> Share My Avatar
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Avatar Panel */}
                    <div className="lg:col-span-5 h-[600px] border border-[#D9D5D2] rounded-3xl overflow-hidden relative shadow-[0_4px_24px_rgba(142,134,123,0.15)] bg-[#F0EADD]">
                        {bodyProfile ? (
                            <VirtualTryOnCanvas />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#F3F0E2] text-center p-8 border-2 border-dashed border-[#D9D5D2] rounded-3xl m-4">
                                <Shirt className="w-16 h-16 text-[#8E867B] mb-6 opacity-60" />
                                <h3 className="text-2xl font-bold text-[#3d3830] mb-2">No Avatar Found</h3>
                                <p className="text-[#8E867B] mb-8">You haven't completed the 3D body scan or manual setup yet.</p>
                                <Link to="/discover" className="px-8 py-4 font-bold rounded-xl active:scale-95 shadow-[0_4px_16px_rgba(142,134,123,0.2)]" style={{ background: '#8E867B', color: '#F3F0E2' }}>
                                    Browse Clothes to Try
                                </Link>
                            </div>
                        )}

                        {bodyProfile && (
                            <div className="absolute top-6 left-6 right-6 flex justify-between pointer-events-none">
                                <div className="bg-[#E8E0D6] backdrop-blur-md px-4 py-2 border border-[#D9D5D2] rounded-full">
                                    <span className="text-[#3d3830] text-sm font-bold opacity-80 uppercase tracking-widest">Idle Model</span>
                                </div>
                                <div className="bg-[#E8E0D6] backdrop-blur-md px-4 py-2 border border-[#D9D5D2] rounded-full shadow-[0_4px_16px_rgba(142,134,123,0.1)]">
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
                                <h2 className="text-2xl font-heading font-bold text-[#3d3830] mb-6">Your Metrics</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-[#F0EADD] border border-[#D9D5D2] rounded-2xl p-5 flex flex-col justify-center">
                                        <span className="text-[#8E867B] text-xs uppercase font-bold tracking-wider mb-1">Height</span>
                                        <span className="text-2xl font-black text-[#3d3830]">{bodyProfile.height} <span className="text-sm font-medium text-[#8E867B]">cm</span></span>
                                    </div>
                                    <div className="bg-[#F0EADD] border border-[#D9D5D2] rounded-2xl p-5 flex flex-col justify-center">
                                        <span className="text-[#8E867B] text-xs uppercase font-bold tracking-wider mb-1">Weight</span>
                                        <span className="text-2xl font-black text-[#3d3830]">{bodyProfile.weight} <span className="text-sm font-medium text-[#8E867B]">kg</span></span>
                                    </div>
                                    <div className="bg-[#F0EADD] border border-[#D9D5D2] rounded-2xl p-5 flex flex-col justify-center">
                                        <span className="text-[#8E867B] text-xs uppercase font-bold tracking-wider mb-1">Body Shape</span>
                                        <span className="text-xl font-bold line-clamp-1" style={{ color: '#3d3830' }}>{bodyProfile.bodyShape}</span>
                                    </div>
                                    <div className="bg-[#F0EADD] border border-[#D9D5D2] rounded-2xl p-5 flex flex-col justify-center">
                                        <span className="text-[#8E867B] text-xs uppercase font-bold tracking-wider mb-1">Generated Via</span>
                                        <span className="text-sm font-bold text-[#3d3830] capitalize">{bodyProfile.measurementSource} Scan</span>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Recent Outfits */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-heading font-bold text-[#3d3830]">Saved Looks</h2>
                                <span className="text-sm font-bold text-[#3d3830] bg-[#E8E0D6] px-3 py-1 rounded-full">{wardrobe.length} Items</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {wardrobe.map((item) => (
                                    <div key={item.id} className="group bg-[#F0EADD] hover:bg-[#E8E0D6] transition-colors border border-[#D9D5D2] rounded-3xl p-5 relative overflow-hidden flex flex-col h-[200px]">

                                        {/* Mock Icon Graphic */}
                                        <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-20 bg-gradient-to-br from-[#E8E0D6]/20 to-transparent flex items-center justify-center">
                                            <Shirt className="w-12 h-12 text-[#8E867B]" />
                                        </div>

                                        <div className="flex justify-between items-start mb-auto relative z-10">
                                            <div className="p-2.5 rounded-xl border border-[#D9D5D2] shadow-inner" style={{ backgroundColor: item.color }}></div>
                                            <button className="text-[#8E867B] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="relative z-10">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md" style={{ background: '#E8E0D6', color: '#8E867B' }}>
                                                    {item.type}
                                                </span>
                                                <span className="text-[#8E867B] text-xs flex items-center gap-1">
                                                    <Tag className="w-3 h-3" /> {item.date}
                                                </span>
                                            </div>
                                            <h4 className="text-[#3d3830] font-bold leading-snug line-clamp-2">{item.name}</h4>
                                        </div>

                                    </div>
                                ))}

                                {/* Empty Add Slot */}
                                <Link to="/discover" className="border-2 border-dashed border-[#D9D5D2] hover:border-[#8E867B] rounded-3xl p-5 flex flex-col items-center justify-center h-[200px] transition-colors text-[#8E867B] hover:text-[#3d3830] group">
                                    <div className="w-12 h-12 rounded-full bg-[#E8E0D6] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
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
