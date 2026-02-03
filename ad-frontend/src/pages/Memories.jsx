import { useState, useEffect } from 'react';
import api from '../services/api';
import MemoryCard from '../components/features/memories/MemoryCard';
import AddMemoryModal from '../components/features/memories/AddMemoryModal';
import { Plus } from 'lucide-react';
import clsx from 'clsx';

export default function Memories() {
    const [memories, setMemories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchMemories = async () => {
        try {
            const res = await api.get('/memories');
            setMemories(res.data);
        } catch (err) {
            console.error('Failed to fetch memories', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMemories();
    }, []);

    return (
        <div className="relative min-h-[80vh]">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-cursive text-rose-600">Our Timeline</h2>
                <p className="text-gray-500">Collect moments, not things.</p>
            </div>

            {loading ? (
                <div className="text-center text-rose-400">Loading moments...</div>
            ) : memories.length === 0 ? (
                <div className="text-center text-gray-400 py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                    <p>No memories yet. Add your first one! 📸</p>
                </div>
            ) : (
                <div className="relative max-w-4xl mx-auto px-4 pb-24">
                    {/* Central Dashed Line (Desktop Only) */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-rose-200 -z-10 -translate-x-1/2 hidden md:block border-l-2 border-dashed border-rose-200 bg-transparent"></div>

                    {/* Vertical Line for Mobile */}
                    <div className="absolute left-8 top-0 bottom-0 w-1 bg-rose-200 md:hidden -z-10"></div>

                    <div className="relative space-y-16 md:space-y-0">
                        {memories
                            .sort((a, b) => new Date(b.memory_date) - new Date(a.memory_date)) // Newest first
                            .map((memory, index) => (
                                <div key={memory.id} className={clsx(
                                    "relative flex items-center md:justify-between",
                                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                                )}>
                                    {/* Timeline Dot */}
                                    {/* Mobile Dot */}
                                    <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 w-4 h-4 bg-rose-500 rounded-full border-4 border-white shadow-md z-10"></div>

                                    {/* Card Wrapper */}
                                    <div className={clsx(
                                        "w-full md:w-[45%] pl-16 md:pl-0 mt-8 md:mt-0"
                                    )}>
                                        <MemoryCard memory={memory} index={index} />
                                    </div>

                                    {/* Empty space for the other side */}
                                    <div className="hidden md:block w-[45%]"></div>
                                </div>
                            ))}
                    </div>
                </div>
            )
            }

            {/* Floating Action Button */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-24 md:bottom-10 right-6 md:right-10 w-14 h-14 bg-rose-600 text-white rounded-full shadow-lg shadow-rose-300 flex items-center justify-center hover:scale-110 transition active:scale-95 z-40"
            >
                <Plus size={24} />
            </button>

            <AddMemoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onMemoryAdded={fetchMemories}
            />
        </div >
    );
}
