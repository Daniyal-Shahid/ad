import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, MapPin, Heart } from 'lucide-react';
import api from '../services/api';
import Envelope from '../components/features/dates/Envelope';
import InvitationDetails from '../components/features/dates/InvitationDetails';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dates() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedInvitation, setSelectedInvitation] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [acceptedInvitation, setAcceptedInvitation] = useState(null);

    const fetchInvitations = async () => {
        try {
            const res = await api.get('/invitations');
            setInvitations(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvitations();
    }, []);

    const handleRespond = async (id, status) => {
        try {
            await api.put(`/invitations/${id}/respond`, { status });

            if (status === 'accepted') {
                const invitation = invitations.find(i => i.id === id);
                setAcceptedInvitation(invitation);
                setShowSuccessModal(true);
            } else {
                alert('Response sent.');
            }

            setSelectedInvitation(null);
            fetchInvitations();
        } catch (err) {
            console.error(err);
            alert('Failed to respond');
        }
    };

    const pendingInvitations = invitations.filter(i => i.status === 'pending' && i.recipient_id === user?.id);
    const myPendingSent = invitations.filter(i => i.status === 'pending' && i.sender_id === user?.id);
    const upcomingDates = invitations.filter(i => i.status === 'accepted');

    // Acceptance Modal Component
    const AcceptanceModal = ({ invitation, onClose }) => {
        if (!invitation) return null;

        return (
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0, y: 50 }}
                        animate={{
                            scale: 1,
                            opacity: 1,
                            y: 0,
                            transition: {
                                type: "spring",
                                damping: 15,
                                stiffness: 300
                            }
                        }}
                        exit={{ scale: 0.8, opacity: 0, y: 20 }}
                        className="bg-gradient-to-br from-rose-50 to-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-rose-100"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-center">
                            {/* Animated Heart Icon */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 10, -10, 0]
                                }}
                                transition={{
                                    duration: 0.6,
                                    repeat: Infinity,
                                    repeatDelay: 1,
                                    ease: "easeInOut"
                                }}
                                className="inline-block"
                            >
                                <Heart className="w-20 h-20 text-rose-500 fill-current" />
                            </motion.div>

                            {/* Success Message */}
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-3xl font-cursive text-rose-600 mt-4 mb-2"
                            >
                                Yay! It's a Date!
                            </motion.h2>

                            {/* Date Details */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="mt-6 space-y-3 text-left bg-white/50 rounded-xl p-4 border border-rose-100"
                            >
                                <div>
                                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Date</p>
                                    <p className="text-lg font-bold text-gray-800">{invitation.title}</p>
                                </div>

                                <div className="flex items-center gap-2 text-gray-600">
                                    <Calendar size={16} className="text-rose-400" />
                                    <span className="text-sm">
                                        {new Date(invitation.date_time).toLocaleDateString(undefined, {
                                            weekday: 'long',
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 text-gray-600">
                                    <MapPin size={16} className="text-rose-400" />
                                    <span className="text-sm">{invitation.location}</span>
                                </div>
                            </motion.div>

                            {/* Dismiss Button */}
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                onClick={onClose}
                                className="mt-6 px-8 py-3 bg-rose-500 text-white rounded-full font-bold hover:bg-rose-600 hover:scale-105 transition-all shadow-lg shadow-rose-200"
                            >
                                Got it!
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        );
    };

    return (
        <div className="min-h-[80vh] pb-20">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-cursive text-rose-600">Date Night</h2>
                    <p className="text-gray-500">Plan your next romantic adventure.</p>
                </div>
                <button
                    onClick={() => navigate('/dates/create')}
                    className="w-12 h-12 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition"
                >
                    <Plus size={24} />
                </button>
            </header>

            {/* Pending Envelopes Section */}
            {pendingInvitations.length > 0 && (
                <div className="mb-12">
                    <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider mb-4">You have a new invitation!</h3>
                    <div className="flex flex-wrap gap-8 justify-center">
                        {pendingInvitations.map(invitation => (
                            <Envelope
                                key={invitation.id}
                                invitation={invitation}
                                onOpen={setSelectedInvitation}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Sent Pending */}
            {myPendingSent.length > 0 && (
                <div className="mb-8 p-4 bg-amber-50 border border-amber-100 rounded-xl text-center">
                    <p className="text-amber-800 text-sm">Waiting for partner's response to <strong>{myPendingSent.length}</strong> invitation(s)...</p>
                </div>
            )}

            {/* Upcoming Dates List */}
            <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Upcoming Dates</h3>
                {upcomingDates.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200">
                        <p className="text-gray-400">No upcoming dates planned yet.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {upcomingDates.map(date => (
                            <motion.div
                                key={date.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:shadow-md transition"
                                onClick={() => setSelectedInvitation(date)}
                            >
                                <div className={clsx(
                                    "w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xl",
                                    date.vibe === 'cute' ? "bg-rose-100 text-rose-500" :
                                        date.vibe === 'cozy' ? "bg-amber-100 text-amber-600" : "bg-purple-100 text-purple-600"
                                )}>
                                    {new Date(date.date_time).getDate()}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-800 text-lg">{date.title}</h4>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Calendar size={14} className="mr-1" />
                                        {new Date(date.date_time).toLocaleDateString(undefined, { weekday: 'short', month: 'short' })} • {new Date(date.date_time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                                <div className="text-xs font-bold px-2 py-1 bg-green-100 text-green-600 rounded">
                                    CONFIRMED
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {selectedInvitation && (
                <InvitationDetails
                    invitation={selectedInvitation}
                    onClose={() => setSelectedInvitation(null)}
                    onRespond={handleRespond}
                />
            )}

            {showSuccessModal && acceptedInvitation && (
                <AcceptanceModal
                    invitation={acceptedInvitation}
                    onClose={() => {
                        setShowSuccessModal(false);
                        setAcceptedInvitation(null);
                    }}
                />
            )}
        </div>
    );
}
