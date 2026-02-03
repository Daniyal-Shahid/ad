import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Heart, Calendar, User } from 'lucide-react';
import clsx from 'clsx';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../context/AuthContext';

export default function Layout({ children }) {
    const { user } = useAuth();
    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        if (!user) return;

        // Initial fetch
        const fetchPending = async () => {
            const { count } = await supabase
                .from('date_invitations')
                .select('id', { count: 'exact', head: true })
                .eq('recipient_id', user.id)
                .eq('status', 'pending');
            setPendingCount(count || 0);
        };

        fetchPending();

        // Realtime subscription
        const channel = supabase
            .channel('invitations-badge')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'date_invitations', filter: `recipient_id=eq.${user.id}` },
                (payload) => {
                    fetchPending(); // Re-fetch count on any change
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    const navItems = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Memories', path: '/memories', icon: Heart },
        { name: 'Dates', path: '/dates', icon: Calendar, badge: pendingCount > 0 ? pendingCount : null },
        { name: 'Profile', path: '/profile', icon: User },
    ];

    return (
        <div className="min-h-screen bg-warm-50 font-sans text-gray-800 pb-20 md:pb-0 md:pl-64">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 fixed left-0 top-0 bottom-0 bg-white border-r border-rose-100 p-6 z-50">
                <h1 className="text-3xl font-cursive text-rose-600 mb-10 text-center">Ad</h1>
                <nav className="space-y-4">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) => clsx(
                                "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group relative",
                                isActive ? "bg-rose-50 text-rose-600 shadow-sm font-bold" : "text-gray-400 hover:bg-gray-50 hover:text-rose-400"
                            )}
                        >
                            <item.icon size={24} className="group-hover:scale-110 transition-transform" />
                            <span>{item.name}</span>
                            {item.badge && (
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce">
                                    {item.badge}
                                </span>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="p-4 md:p-10 max-w-5xl mx-auto">
                {children}
            </main>

            {/* Mobile Bottom Tab Bar */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-rose-100 px-6 py-4 flex justify-between items-center z-50 shadow-lg shadow-rose-100 rounded-t-3xl pb-safe">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) => clsx(
                            "flex flex-col items-center gap-1 transition-all relative",
                            isActive ? "text-rose-500 scale-110" : "text-gray-300"
                        )}
                    >
                        {({ isActive }) => (
                            <>
                                <div className="relative">
                                    <item.icon size={28} strokeWidth={item.name === 'Home' || isActive ? 2.5 : 2} />
                                    {item.badge && (
                                        <span className="absolute -top-1 -right-2 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
                                            {item.badge}
                                        </span>
                                    )}
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-wider">{item.name}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
}
