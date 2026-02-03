import { motion } from 'framer-motion';
import { Calendar, MapPin, Check, X } from 'lucide-react';

export default function InvitationDetails({ invitation, onRespond, onClose }) {
    if (!invitation) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative"
            >
                <div className={`h-32 ${invitation.vibe === 'cute' ? 'bg-rose-100' :
                        invitation.vibe === 'cozy' ? 'bg-amber-100' :
                            'bg-purple-100' // fancy
                    } relative`}>
                    {/* Texture/Pattern overlay can go here */}
                    <button onClick={onClose} className="absolute top-4 right-4 bg-white/50 p-2 rounded-full hover:bg-white text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                <div className="px-8 pb-8 -mt-12 relative z-10">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
                        <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                            {invitation.vibe}
                        </span>
                        <h2 className="text-2xl font-bold font-cursive text-gray-800 mb-4">{invitation.title}</h2>

                        <div className="space-y-3 mb-6 text-left">
                            <div className="flex items-center text-gray-600">
                                <Calendar size={18} className="mr-3 text-rose-500" />
                                <span>{new Date(invitation.date_time).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <MapPin size={18} className="mr-3 text-rose-500" />
                                <span>{invitation.location}</span>
                            </div>
                        </div>

                        {invitation.personal_message && (
                            <div className="bg-rose-50 p-4 rounded-xl text-rose-800 italic font-serif mb-6 text-sm">
                                "{invitation.personal_message}"
                            </div>
                        )}

                        {invitation.status === 'pending' ? (
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => onRespond(invitation.id, 'declined')}
                                    className="py-3 border-2 border-gray-200 text-gray-500 font-bold rounded-xl hover:bg-gray-50 transition"
                                >
                                    Decline
                                </button>
                                <button
                                    onClick={() => onRespond(invitation.id, 'accepted')}
                                    className="py-3 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600 shadow-lg shadow-rose-200 transition flex items-center justify-center gap-2"
                                >
                                    <Check size={18} /> Say Yes!
                                </button>
                            </div>
                        ) : (
                            <div className="text-center font-bold text-lg text-gray-400 uppercase tracking-widest">
                                {invitation.status}
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
