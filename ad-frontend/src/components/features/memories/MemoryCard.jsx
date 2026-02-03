import { motion } from 'framer-motion';
import { Calendar, Heart } from 'lucide-react';

export default function MemoryCard({ memory, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="bg-white rounded-3xl overflow-hidden shadow-xl border border-rose-100 hover:shadow-2xl transition-shadow duration-300"
        >
            {memory.image_url && (
                <div className="h-64 overflow-hidden relative group">
                    <img
                        src={memory.image_url}
                        alt={memory.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
                    <span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-rose-600">
                        {memory.category}
                    </span>
                </div>
            )}

            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-bold text-gray-800">{memory.title}</h3>
                    <div className="flex items-center text-gray-400 text-sm">
                        <Calendar size={14} className="mr-1" />
                        {new Date(memory.memory_date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                    </div>
                </div>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line font-serif text-lg">
                    {memory.description}
                </p>
            </div>
        </motion.div>
    );
}
