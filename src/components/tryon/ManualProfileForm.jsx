import React, { useState } from 'react';
import useTryOnStore from '../../store/useTryOnStore';
import useAuthStore from '../../store/useAuthStore';

// Fitzpatrick scale approx hexes
const SKIN_TONES = [
    '#fce2c6', '#f5d0b5', '#eccba5', '#e4bd93',
    '#d0a781', '#c09873', '#b18660', '#966a4a',
    '#744c33', '#5a3821', '#422818', '#2a1a11'
];

const BODY_SHAPES = [
    { id: 'Rectangle', icon: '▮' },
    { id: 'Hourglass', icon: '⏳' },
    { id: 'Pear', icon: '🍐' },
    { id: 'Apple', icon: '🍎' },
    { id: 'Inverted Triangle', icon: '▼' }
];

export default function ManualProfileForm() {
    const { user } = useAuthStore();
    const { saveManualProfile } = useTryOnStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        height: 170, // cm
        weight: 65, // kg
        gender: 'Female',
        age: 25,
        chest: 90,
        waist: 70,
        hips: 95,
        shoulders: 40,
        inseam: 75,
        neck: 35,
        skinTone: '#f5d0b5',
        bodyShape: 'Hourglass',
        measurementSource: 'manual'
    });

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError("You must be logged in to save a Try-On profile.");
            return;
        }
        setLoading(true);
        setError(null);

        const res = await saveManualProfile(formData, user.token);
        if (!res.success) {
            setError(res.error || "Failed to save profile. Try again.");
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="animate-fade-in text-white/90">
            <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Manual Measurements</h3>
                <p className="text-[#8b8ba0]">Provide your standard measurements. The more accurate, the better your clothes will fit virtually.</p>
                {error && <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm">{error}</div>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">

                {/* Core Stats */}
                <div className="space-y-6">
                    <h4 className="font-semibold border-b border-white/10 pb-2" style={{ color: '#8E867B' }}>Core Demographics</h4>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-[#8b8ba0] uppercase tracking-wider mb-2">Height (cm)</label>
                            <input type="number" name="height" value={formData.height} onChange={handleChange} required
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none transition-colors"
                                style={{ '--tw-ring-color': 'transparent' }}
                                onFocus={e => e.currentTarget.style.borderColor = '#8E867B'}
                                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[#8b8ba0] uppercase tracking-wider mb-2">Weight (kg)</label>
                            <input type="number" name="weight" value={formData.weight} onChange={handleChange} required
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none transition-colors"
                                style={{ '--tw-ring-color': 'transparent' }}
                                onFocus={e => e.currentTarget.style.borderColor = '#8E867B'}
                                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-[#8b8ba0] uppercase tracking-wider mb-2">Gender</label>
                            <select name="gender" value={formData.gender} onChange={handleChange}
                                className="w-full bg-[#13131f] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none appearance-none transition-colors"
                                onFocus={e => e.currentTarget.style.borderColor = '#8E867B'}
                                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                            >
                                <option value="Female">Female</option>
                                <option value="Male">Male</option>
                                <option value="Non-binary">Non-binary</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[#8b8ba0] uppercase tracking-wider mb-2">Age</label>
                            <input type="number" name="age" value={formData.age} onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none transition-colors"
                                onFocus={e => e.currentTarget.style.borderColor = '#8E867B'}
                                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                            />
                        </div>
                    </div>
                </div>

                {/* Detailed Measurements */}
                <div className="space-y-6">
                    <h4 className="font-semibold border-b border-white/10 pb-2" style={{ color: '#8E867B' }}>Detailed Measurements (cm)</h4>

                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs text-[#8b8ba0] mb-1">Chest</label>
                            <input type="number" name="chest" value={formData.chest} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors" onFocus={e => e.currentTarget.style.borderColor = '#8E867B'} onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'} />
                        </div>
                        <div>
                            <label className="block text-xs text-[#8b8ba0] mb-1">Waist</label>
                            <input type="number" name="waist" value={formData.waist} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors" onFocus={e => e.currentTarget.style.borderColor = '#8E867B'} onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'} />
                        </div>
                        <div>
                            <label className="block text-xs text-[#8b8ba0] mb-1">Hips</label>
                            <input type="number" name="hips" value={formData.hips} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors" onFocus={e => e.currentTarget.style.borderColor = '#8E867B'} onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'} />
                        </div>
                        <div>
                            <label className="block text-xs text-[#8b8ba0] mb-1">Shoulders</label>
                            <input type="number" name="shoulders" value={formData.shoulders} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors" onFocus={e => e.currentTarget.style.borderColor = '#8E867B'} onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'} />
                        </div>
                        <div>
                            <label className="block text-xs text-[#8b8ba0] mb-1">Inseam</label>
                            <input type="number" name="inseam" value={formData.inseam} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors" onFocus={e => e.currentTarget.style.borderColor = '#8E867B'} onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'} />
                        </div>
                        <div>
                            <label className="block text-xs text-[#8b8ba0] mb-1">Neck</label>
                            <input type="number" name="neck" value={formData.neck} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors" onFocus={e => e.currentTarget.style.borderColor = '#8E867B'} onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Visual Attributes */}
            <div className="space-y-6 mb-10">
                <div>
                    <label className="block text-sm font-medium text-white mb-3">Skin Tone</label>
                    <div className="flex flex-wrap gap-2">
                        {SKIN_TONES.map(color => (
                            <button
                                key={color}
                                type="button"
                                onClick={() => setFormData({ ...formData, skinTone: color })}
                                className={`w-10 h-10 rounded-full border-2 transition-transform ${formData.skinTone === color ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.4)]' : 'border-transparent hover:scale-105'}`}
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-white mb-3">Dominant Body Shape</label>
                    <div className="flex flex-wrap gap-4">
                        {BODY_SHAPES.map(shape => (
                            <button
                                key={shape.id}
                                type="button"
                                onClick={() => setFormData({ ...formData, bodyShape: shape.id })}
                                className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${formData.bodyShape === shape.id ? '' : 'border-white/10 bg-white/5 text-[#8b8ba0] hover:bg-white/10'}`}
                                style={formData.bodyShape === shape.id ? { borderColor: '#8E867B', background: 'rgba(142,134,123,0.1)', color: '#8E867B' } : {}}
                            >
                                <span className="text-2xl mb-2">{shape.icon}</span>
                                <span className="text-xs font-semibold">{shape.id}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-white/10">
                <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3.5 rounded-xl font-bold hover:brightness-110 transition-all flex items-center justify-center min-w-[200px]"
                    style={{ background: '#8E867B', color: '#F3F0E2' }}
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-[#08080e]/30 border-t-[#08080e] rounded-full animate-spin" />
                    ) : (
                        'Generate 3D Avatar'
                    )}
                </button>
            </div>

        </form>
    );
}
