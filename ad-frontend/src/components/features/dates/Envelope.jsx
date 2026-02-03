import { motion } from 'framer-motion';
import { useState } from 'react';
import { Heart } from 'lucide-react';
import clsx from 'clsx';

export default function Envelope({ invitation, onOpen }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        if (!isOpen) {
            setIsOpen(true);
            setTimeout(() => onOpen(invitation), 800); // Trigger details after animation
        }
    };

    return (
        <div className="flex justify-center items-center py-10 perspective-1000">
            <motion.div
                className="relative w-72 h-48 cursor-pointer"
                onClick={handleOpen}
                initial={false}
                animate={isOpen ? "open" : "closed"}
            >
                {/* Envelope Base */}
                <div className="absolute inset-0 bg-rose-200 rounded-lg shadow-xl z-10 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 border-4 border-rose-300 rounded-lg pointer-events-none"></div>
                </div>

                {/* Flap */}
                <motion.div
                    className="absolute top-0 left-0 w-full h-1/2 bg-rose-300 origin-top z-30 rounded-t-lg shadow-sm"
                    variants={{
                        closed: { rotateX: 0 },
                        open: { rotateX: 180, zIndex: 0, transition: { duration: 0.6 } }
                    }}
                    style={{
                        clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
                        backfaceVisibility: 'hidden'
                    }}
                >
                </motion.div>

                {/* Letter Inside (Slides up) */}
                <motion.div
                    className="absolute left-4 right-4 bg-white p-4 shadow-md z-20 h-40 rounded-sm text-center flex flex-col items-center justify-center border border-gray-100"
                    variants={{
                        closed: { y: 0 },
                        open: { y: -100, transition: { delay: 0.3, duration: 0.5 } }
                    }}
                >
                    <Heart className="w-8 h-8 text-rose-500 mb-2 fill-current" />
                    <h3 className="font-cursive text-xl text-gray-800 leading-none mb-1">For You</h3>
                    <p className="text-xs text-gray-500 uppercase tracking-widest">{invitation.sender?.name}</p>
                </motion.div>

                {/* Envelope Front (Triangles to look like envelope) */}
                <div className="absolute inset-0 z-30 pointer-events-none">
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-rose-200" style={{ clipPath: 'polygon(0 0, 50% 50%, 100% 0, 100% 100%, 0 100%)' }}></div>
                    {/* Seal */}
                    {!isOpen && (
                        <motion.div
                            initial={{ scale: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-lg border-2 border-red-700 z-50"
                        >
                            <Heart className="text-red-100 w-5 h-5 fill-current" />
                        </motion.div>
                    )}
                </div>

            </motion.div>
        </div>
    );
}
