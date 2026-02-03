import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../hooks/useModal';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Heart, RefreshCw, Send } from 'lucide-react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import CardDesigner from '../components/features/designer/CardDesigner';

export default function Dashboard() {
    const { user, profile, signOut, refreshProfile } = useAuth();
    const { showModal } = useModal();
    const [inviteCode, setInviteCode] = useState(null);
    const [inputCode, setInputCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [partner, setPartner] = useState(null);
    const navigate = useNavigate();

    // Use profile.paired_with instead of user_metadata
    const isPaired = !!profile?.paired_with;

    useEffect(() => {
        if (isPaired && !profile?.pairing_date) {
            // If paired but no date, maybe fetch or just default to 1 day
        }
    }, [isPaired, profile]);

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

    const calculateDaysTogether = () => {
        if (!profile?.pairing_date) return 1;
        const start = new Date(profile.pairing_date);
        const now = new Date();
        const diffTime = Math.abs(now - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const handleGenerateCode = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.post('/user/code');
            setInviteCode(res.data.invite_code);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to generate code');
        } finally {
            setLoading(false);
        }
    };

    const handlePair = async (e) => {
        e.preventDefault();
        if (!inputCode || inputCode.length !== 6) return;

        setLoading(true);
        setError(null);
        try {
            const res = await api.post('/user/pair', { inviteCode: inputCode });
            showModal({
                type: 'success',
                title: 'It\'s a Match!',
                message: `You are now paired with ${res.data.partner.name}! 💖`,
                onConfirm: refreshProfile
            });
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to pair');
            showModal({
                type: 'error',
                title: 'Pairing Failed',
                message: err.response?.data?.error || 'Could not pair with this code.'
            });
        } finally {
            setLoading(false);
        }
    };

    if (isPaired) {
        return (
            <div className="flex flex-col items-center">
                <header className="w-full max-w-4xl flex justify-between items-center mb-8 md:hidden">
                    <h1 className="text-2xl font-cursive text-rose-600">Couples App</h1>
                    <button onClick={signOut} className="text-rose-600 hover:underline text-sm">Sign Out</button>
                </header>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-lg w-full border border-rose-100"
                >
                    <div className="flex justify-center mb-6 relative">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                        >
                            <Heart className="w-20 h-20 text-rose-500 fill-current animate-pulse drop-shadow-lg" />
                        </motion.div>
                    </div>
                    <h2 className="text-4xl font-bold text-gray-800 mb-2">You & {partner?.name}</h2>

                    <div className="mb-8">
                        <span className="text-6xl font-bold text-rose-500">{calculateDaysTogether()}</span>
                        <span className="text-xl text-gray-400 ml-2">days</span>
                    </div>

                    <div className="mb-0">
                        <CardDesigner />
                    </div>

                    <div className="grid gap-3">
                        <button onClick={() => navigate('/memories')} className="w-full py-4 bg-rose-500 text-white rounded-2xl font-bold hover:bg-rose-600 transition shadow-lg shadow-rose-200 flex items-center justify-center gap-2">
                            View Our Timeline
                        </button>
                        <button onClick={() => navigate('/dates')} className="w-full py-4 bg-white text-rose-600 border-2 border-rose-100 rounded-2xl font-bold hover:bg-rose-50 transition">
                            Plan a Date
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-cursive text-rose-600 mb-4 animate-float">Let's Connect</h1>
                    <p className="text-gray-600">Pair with your favorite person to start your journey.</p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-rose-100">
                    <div className="p-8">
                        {/* Generate Code Section */}
                        <div className="mb-8 text-center">
                            <label className="block text-xs font-bold text-rose-400 mb-3 text-left uppercase tracking-wider">Your Invite Code</label>
                            {inviteCode || profile?.invite_code ? (
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="bg-rose-50 border-2 border-dashed border-rose-300 rounded-xl p-6 flex items-center justify-between group cursor-pointer"
                                    onClick={() => navigator.clipboard.writeText(inviteCode || profile?.invite_code)}
                                >
                                    <span className="text-4xl font-mono font-bold text-gray-800 tracking-widest">{inviteCode || profile?.invite_code}</span>
                                    <button
                                        className="p-3 bg-white text-rose-500 rounded-full shadow-sm group-hover:scale-110 transition"
                                    >
                                        <Copy size={20} />
                                    </button>
                                </motion.div>
                            ) : (
                                <button
                                    onClick={handleGenerateCode}
                                    disabled={loading}
                                    className="w-full py-4 border-2 border-rose-500 text-rose-500 rounded-xl font-bold text-lg hover:bg-rose-50 transition flex items-center justify-center gap-2"
                                >
                                    <RefreshCw size={24} className={clsx(loading && "animate-spin")} />
                                    Generate My Code
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-px bg-gray-200 flex-1"></div>
                            <span className="text-gray-400 text-xs font-bold uppercase">OR</span>
                            <div className="h-px bg-gray-200 flex-1"></div>
                        </div>

                        {/* Enter Code Section */}
                        <form onSubmit={handlePair}>
                            <label className="block text-xs font-bold text-rose-400 mb-3 text-left uppercase tracking-wider">Enter Partner's Code</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    maxLength={6}
                                    value={inputCode}
                                    onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                                    placeholder="ABC123"
                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-2xl font-mono tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-rose-500 transition text-center"
                                />
                                <button
                                    type="submit"
                                    disabled={loading || inputCode.length !== 6}
                                    className="bg-rose-500 text-white px-6 rounded-xl hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-rose-200"
                                >
                                    <Send size={28} />
                                </button>
                            </div>
                        </form>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="mt-4 text-red-500 text-center text-sm bg-red-50 p-3 rounded-xl border border-red-100"
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="bg-rose-50/50 p-4 text-center border-t border-rose-100">
                        <button onClick={signOut} className="text-xs font-bold text-rose-400 hover:text-rose-600 uppercase tracking-widest">
                            Sign out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

