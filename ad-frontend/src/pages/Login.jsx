import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await signIn({ email, password });
        if (error) alert(error.message);
        else navigate('/');
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-rose-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-rose-100">
                <h2 className="text-3xl font-cursive text-center text-rose-600 mb-6">Welcome Back, Love</h2>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            required
                            className="mt-1 block w-full px-3 py-2 bg-warm-100 border border-rose-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            required
                            className="mt-1 block w-full px-3 py-2 bg-warm-100 border border-rose-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-rose-500 hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <Link to="/signup" className="text-sm text-rose-500 hover:text-rose-600">Don't have an account? Sign up</Link>
                </div>
            </div>
        </div>
    );
}
