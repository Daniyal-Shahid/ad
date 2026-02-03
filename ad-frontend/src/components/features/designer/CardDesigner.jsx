import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Save, X, Undo, Redo } from 'lucide-react';
import { useDesigner } from '../../../context/DesignerContext';
import DesignCanvas from './DesignCanvas';
import DesignTools from './DesignTools';
import StylePanel from './StylePanel';
import api from '../../../services/api';

export default function CardDesigner() {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const {
        design,
        isDirty,
        isSaving,
        canUndo,
        canRedo,
        undo,
        redo,
        loadDesign,
        saveDesign
    } = useDesigner();

    // Load user's latest design on mount
    useEffect(() => {
        const loadLatestDesign = async () => {
            try {
                const response = await api.get('/designs');
                if (response.data.length > 0) {
                    // Load most recent design
                    const latest = response.data[0];
                    await loadDesign(latest.id);
                }
            } catch (error) {
                console.error('Failed to load design:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadLatestDesign();
    }, [loadDesign]);

    const handleSave = async () => {
        try {
            await saveDesign('My Card Design');
            setIsEditing(false);
        } catch (error) {
            alert('Failed to save design. Please try again.');
        }
    };

    const handleCancel = () => {
        if (isDirty) {
            const confirmed = window.confirm('You have unsaved changes. Are you sure you want to discard them?');
            if (!confirmed) return;
        }
        setIsEditing(false);
    };

    if (isLoading) {
        return (
            <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-rose-500 border-t-transparent mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading your design...</p>
            </div>
        );
    }

    return (
        <>
            {/* Preview Card */}
            <div className="relative w-full max-w-lg mx-auto mb-8">
                <div className="flex justify-between items-center mb-2 px-2">
                    <span className="text-xs font-bold text-rose-300 uppercase tracking-widest">
                        Your Card
                    </span>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition"
                        title="Edit Card"
                    >
                        <Pencil size={16} />
                    </button>
                </div>

                <div
                    className="relative bg-white rounded-2xl border border-rose-100 aspect-[3/4] w-full max-w-[300px] mx-auto overflow-hidden cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group shadow-lg shadow-rose-100"
                    onClick={() => setIsEditing(true)}
                    style={{
                        backgroundColor: design.background || '#ffffff',
                        backgroundImage: design.backgroundImage ? `url(${design.backgroundImage})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors z-10 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 p-3 bg-white/90 backdrop-blur-sm rounded-full text-rose-500 shadow-xl scale-75 group-hover:scale-100 transition-all duration-300">
                            <Pencil size={24} />
                        </div>
                    </div>
                    <div className="p-0 h-full w-full">
                        <div className="relative w-full h-full">
                            {design.elements.map(el => (
                                <div
                                    key={el.id}
                                    style={{
                                        ...el.style,
                                        position: 'absolute',
                                        left: `${el.x}%`,
                                        top: `${el.y}%`,
                                        transform: `translate(-50%, -50%) rotate(${el.style?.rotation || 0}deg)`,
                                        whiteSpace: 'pre-wrap',
                                        opacity: el.style?.opacity !== undefined ? el.style.opacity : 1
                                    }}
                                >
                                    {el.type === 'text' ? (
                                        el.content
                                    ) : (
                                        <img
                                            src={el.content}
                                            alt="Card element"
                                            className="max-w-full"
                                            style={el.style}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Editor Modal */}
            <AnimatePresence>
                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-gray-900/95 backdrop-blur-sm flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-4 bg-white border-b border-gray-200 shadow-sm z-20">
                            <div className="flex items-center gap-4">
                                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <span className="p-1 bg-rose-100 rounded-lg text-rose-600">
                                        <Pencil size={18} />
                                    </span>
                                    Card Designer
                                </h2>

                                {/* Undo/Redo */}
                                <div className="flex gap-1">
                                    <button
                                        onClick={undo}
                                        disabled={!canUndo}
                                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                                        title="Undo"
                                    >
                                        <Undo size={18} />
                                    </button>
                                    <button
                                        onClick={redo}
                                        disabled={!canRedo}
                                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                                        title="Redo"
                                    >
                                        <Redo size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-3 items-center">
                                {isDirty && (
                                    <span className="text-sm text-amber-600">Unsaved changes</span>
                                )}
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition text-sm flex items-center gap-2"
                                >
                                    <X size={18} /> Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="px-6 py-2 bg-rose-500 text-white hover:bg-rose-600 rounded-xl font-bold transition shadow-md flex items-center gap-2 disabled:opacity-50"
                                >
                                    <Save size={18} /> {isSaving ? 'Saving...' : 'Save Card'}
                                </button>
                            </div>
                        </div>

                        {/* Workspace */}
                        <div className="flex-1 flex overflow-hidden">
                            <DesignTools />

                            <div className="flex-1 bg-gray-100 p-8 flex items-center justify-center overflow-auto">
                                <div className="aspect-[3/4] h-full max-h-[80vh] bg-white shadow-2xl rounded-xl overflow-hidden ring-1 ring-gray-200/50">
                                    <DesignCanvas isEditing={true} />
                                </div>
                            </div>

                            <StylePanel />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
