const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client for backend (using service key if available, or anon for now)
// Note: For strict security, verification should verify the JWT signature. 
// Supabase-js 'getUser' does this by calling the Auth server (slower but safer) or we can verify locally.
// For this MVP, we will use getUser with the token passed in Authorization header.

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'No authorization header provided' });
        }

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        // Create an authenticated Supabase client for this request
        const authenticatedSupabase = createClient(supabaseUrl, supabaseKey, {
            global: {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        });

        // Attach user and authenticated client to request
        req.user = user;
        req.supabase = authenticatedSupabase;
        next();
    } catch (err) {
        console.error('Auth middleware error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = authenticate;
