import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../../services/supabase';
import api from '../../../services/api';
import clsx from 'clsx';
import { useAuth } from '../../../context/AuthContext';

export default function AddMemoryModal({ isOpen, onClose, onMemoryAdded }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [category, setCategory] = useState('everyday');
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);
    const { user } = useAuth();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        try {
            let imageUrl = null;

            if (image) {
                const fileExt = image.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${user.id}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('memories')
                    .upload(filePath, image);

                if (uploadError) throw uploadError;

                const { data } = supabase.storage.from('memories').getPublicUrl(filePath);
                imageUrl = data.publicUrl;
            }

            await api.post('/memories', {
                title,
                description,
                memory_date: date,
                category,
                image_url: imageUrl
            });

            onMemoryAdded();
            onClose();
            // Reset form
            setTitle('');
            setDescription('');
            setImage(null);
            setPreview(null);

        } catch (error) {
            console.error('Error adding memory:', error);
            alert('Failed to add memory');
        } finally {
            setUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
                >
                    <div className="bg-rose-50 px-6 py-4 flex justify-between items-center border-b border-rose-100">
                        <h3 className="text-xl font-bold text-rose-600 font-cursive">Add New Memory</h3>
                        <button onClick={onClose} className="p-2 hover:bg-rose-100 rounded-full transition text-rose-400">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {/* Image Upload */}
                        <div className="relative group cursor-pointer aspect-video bg-warm-100 rounded-xl border-2 border-dashed border-rose-200 hover:border-rose-400 transition flex items-center justify-center overflow-hidden">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            />
                            {preview ? (
                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center text-gray-400">
                                    <ImageIcon size={48} className="mx-auto mb-2 text-rose-300" />
                                    <span className="text-sm font-medium">Click to upload photo</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                                placeholder="e.g. First Date info"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date</label>
                                <input
                                    type="date"
                                    required
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                                >
                                    <option value="everyday">Everyday</option>
                                    <option value="date">Date Night</option>
                                    <option value="travel">Travel</option>
                                    <option value="milestone">Milestone</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                                placeholder="Details of the day..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={uploading}
                            className="w-full py-3 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 transition flex items-center justify-center gap-2"
                        >
                            {uploading ? (
                                <>Uploading...</>
                            ) : (
                                <>
                                    <Upload size={18} />
                                    Saved Memory
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
