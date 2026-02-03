import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children }) {
    const { user } = useAuth();

    // Note: Loading state is handled in AuthContext, 
    // so if we reach here, we know if user is null or not.
    // However, AuthContext returns !loading && children, so we are safe.

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
