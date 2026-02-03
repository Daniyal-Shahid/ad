import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Coffee, Star, MapPin, Calendar, ArrowRight, ArrowLeft, Send, Image as ImageIcon, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import clsx from 'clsx';

const steps = [
    { title: 'The Vibe', icon: Heart },
    { title: 'The Details', icon: Calendar },
    { title: 'Personal Note', icon: Star },
];

const vibes = [
    { id: 'cute', label: 'Cute', icon: Heart, color: 'bg-rose-100 text-rose-500', desc: 'Playful & Sweet' },
    { id: 'cozy', label: 'Cozy', icon: Coffee, color: 'bg-amber-100 text-amber-600', desc: 'Warm & Intimate' },
    { id: 'fancy', label: 'Fancy', icon: Star, color: 'bg-purple-100 text-purple-600', desc: 'Elegant & Classy' },
];

export default function CreateDate() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        vibe: '',
        title: '',
        date_time: '',
        location: '',
        activity: '',
        personal_message: '',
        photo: null
    });

    const handleNext = () => {
        if (currentStep < steps.length - 1) setCurrentStep(c => c + 1);
        else handleSubmit();
    };

    const handleBack = () => {
        if (currentStep > 0) setCurrentStep(c => c - 1);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await api.post('/invitations', formData);
            alert('Invitation Sent! 💌');
            navigate('/dates');
        } catch (err) {
            console.error(err);
            alert('Failed to send invitation');
        } finally {
            setLoading(false);
        }
    };

    const updateField = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Photo must be less than 5MB');
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Read and convert to data URL
        const reader = new FileReader();
        reader.onload = (ev) => {
            updateField('photo', ev.target.result);
        };
        reader.readAsDataURL(file);
    };

    const isStepValid = () => {
        if (currentStep === 0) return !!formData.vibe;
        if (currentStep === 1) return !!formData.title && !!formData.date_time && !!formData.location;
        return true;
    };

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
            {/* Progress header */}
            <div className="w-full max-w-2xl mb-8">
                <div className="flex justify-between relative">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -z-10 rounded"></div>
                    <div className="absolute top-1/2 left-0 h-1 bg-rose-500 -z-10 rounded transition-all duration-500" style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}></div>

                    {steps.map((step, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-2">
                            <div className={clsx(
                                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors bg-white",
                                idx <= currentStep ? "border-rose-500 text-rose-500" : "border-gray-200 text-gray-300"
                            )}>
                                <step.icon size={18} />
                            </div>
                            <span className={clsx("text-xs font-bold uppercase tracking-wider", idx <= currentStep ? "text-rose-500" : "text-gray-300")}>
                                {step.title}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <motion.div
                layout
                className="bg-white w-full max-w-lg rounded-3xl shadow-xl border border-rose-100 overflow-hidden"
            >
                <div className="p-8 min-h-[400px] flex flex-col">
                    <AnimatePresence mode='wait'>
                        {currentStep === 0 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex-1"
                            >
                                <h2 className="text-2xl font-bold font-cursive text-rose-600 mb-6 text-center">Chooes the Vibe</h2>
                                <div className="grid gap-4">
                                    {vibes.map((v) => (
                                        <button
                                            key={v.id}
                                            onClick={() => updateField('vibe', v.id)}
                                            className={clsx(
                                                "p-4 rounded-xl border-2 text-left flex items-center gap-4 transition-all hover:scale-[1.02]",
                                                formData.vibe === v.id ? "border-rose-500 bg-rose-50" : "border-gray-100 hover:border-rose-200"
                                            )}
                                        >
                                            <div className={clsx("w-12 h-12 rounded-full flex items-center justify-center", v.color)}>
                                                <v.icon size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-800">{v.label}</h4>
                                                <p className="text-sm text-gray-500">{v.desc}</p>
                                            </div>
                                            {formData.vibe === v.id && <div className="ml-auto text-rose-500 font-bold">Selected</div>}
                                        </button>
                                    ))}
                                </div>

                                {/* Photo Upload Section */}
                                <div className="mt-6">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Add a Photo <span className="text-gray-400 font-normal">(Optional)</span>
                                    </label>

                                    {!formData.photo ? (
                                        <label className="block w-full h-48 border-2 border-dashed border-gray-300 rounded-xl hover:border-rose-400 transition cursor-pointer group">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handlePhotoUpload}
                                            />
                                            <div className="h-full flex flex-col items-center justify-center text-gray-400 group-hover:text-rose-400 transition">
                                                <ImageIcon size={48} />
                                                <span className="mt-2 text-sm">Click to upload a photo</span>
                                            </div>
                                        </label>
                                    ) : (
                                        <div className="relative rounded-xl overflow-hidden">
                                            <img
                                                src={formData.photo}
                                                alt="Date photo"
                                                className="w-full h-48 object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => updateField('photo', null)}
                                                className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition shadow-lg"
                                            >
                                                <X size={16} className="text-gray-600" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 1 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex-1 space-y-4"
                            >
                                <h2 className="text-2xl font-bold font-cursive text-rose-600 mb-6 text-center">The Plan</h2>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        placeholder="Dinner under the stars..."
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                                        value={formData.title}
                                        onChange={(e) => updateField('title', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">When</label>
                                    <input
                                        type="datetime-local"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                                        value={formData.date_time}
                                        onChange={(e) => updateField('date_time', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Where</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Add location"
                                            className="w-full pl-10 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                                            value={formData.location}
                                            onChange={(e) => updateField('location', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Activity (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="Any specific activity?"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                                        value={formData.activity}
                                        onChange={(e) => updateField('activity', e.target.value)}
                                    />
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 2 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex-1"
                            >
                                <h2 className="text-2xl font-bold font-cursive text-rose-600 mb-6 text-center">Add a Note</h2>
                                <textarea
                                    placeholder="I've been wanting to take you here for so long..."
                                    rows={6}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:outline-none resize-none font-serif text-lg leading-relaxed"
                                    value={formData.personal_message}
                                    onChange={(e) => updateField('personal_message', e.target.value)}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Footer Navigation */}
                    <div className="mt-8 flex justify-between pt-6 border-t border-gray-100">
                        <button
                            onClick={handleBack}
                            disabled={currentStep === 0}
                            className="px-6 py-2 rounded-full text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent font-bold flex items-center gap-2 transition"
                        >
                            <ArrowLeft size={18} /> Back
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={!isStepValid() || loading}
                            className="px-8 py-3 bg-rose-500 text-white rounded-full font-bold hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-rose-200 flex items-center gap-2 transition hover:scale-105 active:scale-95"
                        >
                            {loading ? 'Sending...' : currentStep === steps.length - 1 ? (
                                <>Send Invitation <Send size={18} /></>
                            ) : (
                                <>Next Step <ArrowRight size={18} /></>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
