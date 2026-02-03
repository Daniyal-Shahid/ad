import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, LogOut, HeartCrack, Camera } from 'lucide-react';
import { supabase } from '../services/supabase';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export default function Profile() {
    const { user, profile, signOut, refreshProfile } = useAuth();
    const [partner, setPartner] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (profile?.paired_with) {
            const fetchPartner = async () => {
                const { data } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', profile.paired_with)
                    .single();
                setPartner(data);
            };
            fetchPartner();
        }
    }, [profile]);

    const handleAvatarUpload = async (e) => {
        try {
            setUploading(true);
            const file = e.target.files[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${user.id}/${fileName}`;

            // Upload to avatar bucket (need to create if not exists, or reuse memories for MVP)
            // For MVP, using 'memories' bucket or just public URL if I had a bucket
            // Let's assume 'memories' bucket is "public" enough for this MVP or I'll use it.
            const { error: uploadError } = await supabase.storage
                .from('memories') // Reusing memories bucket for simplicity in MVP
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('memories').getPublicUrl(filePath);

            // Update user profile
            await supabase
                .from('users')
                .update({ avatar_url: data.publicUrl })
                .eq('id', user.id);

            refreshProfile();

        } catch (error) {
            console.error('Error uploading avatar:', error);
            alert('Failed to upload avatar');
        } finally {
            setUploading(false);
        }
    };

    const handleUnpair = async () => {
        if (!confirm('Are you sure you want to unpair? This will disconnect your timelines.')) return;
        try {
            await api.post('/user/unpair');
            setPartner(null);
            refreshProfile();
            // Optionally redirect
        } catch (err) {
            console.error(err);
            alert('Failed to unpair');
        }
    };

    return (
        <div className="flex flex-col items-center py-10">
            {/* Profile Header */}
            <div className="relative mb-6 group">
                <div className={clsx(
                    "w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-200 flex items-center justify-center",
                    uploading && "opacity-50"
                )}>
                    {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <User size={64} className="text-gray-400" />
                    )}
                </div>
                <label className="absolute bottom-0 right-0 bg-rose-500 text-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-rose-600 transition">
                    <Camera size={18} />
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
                </label>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-1">{profile?.name || user?.email}</h2>
            <p className="text-gray-400 text-sm mb-10">{user?.email}</p>

            {/* Stats / Partner */}
            <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-lg border border-rose-50 mb-8">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 text-center">Relationship</h3>
                {profile?.paired_with && partner ? (
                    <div className="flex items-center gap-4">
                        <img
                            src={partner.avatar_url || 'https://via.placeholder.com/150'}
                            alt="Partner"
                            className="w-16 h-16 rounded-full border-2 border-rose-200 object-cover"
                        />
                        <div>
                            <h4 className="font-bold text-lg text-gray-800">{partner.name}</h4>
                            <p className="text-rose-500 text-sm">Your Person ❤️</p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-4 text-gray-400">
                        Not paired yet.
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="w-full max-w-md space-y-3">
                <button
                    onClick={signOut}
                    className="w-full py-4 bg-gray-50 text-gray-600 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-100 transition"
                >
                    <LogOut size={20} /> Sign Out
                </button>

                {profile?.paired_with && (
                    <button
                        onClick={handleUnpair}
                        className="w-full py-4 bg-red-50 text-red-500 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-red-100 transition"
                    >
                        <HeartCrack size={20} /> Unpair (Danger Zone)
                    </button>
                )}
            </div>
        </div>
    );
}
