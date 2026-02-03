const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
// const supabase = createClient(supabaseUrl, supabaseKey);

exports.getMemories = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch user to get partner ID
        const { data: user } = await req.supabase.from('users').select('paired_with').eq('id', userId).single();
        const partnerId = user?.paired_with;

        let query = req.supabase
            .from('memories')
            .select('*')
            .order('memory_date', { ascending: false });

        if (partnerId) {
            query = query.in('created_by', [userId, partnerId]);
        } else {
            query = query.eq('created_by', userId);
        }

        const { data: memories, error } = await query;

        if (error) throw error;
        res.json(memories);

    } catch (error) {
        console.error('Get memories error:', error);
        res.status(500).json({ error: 'Failed to fetch memories' });
    }
};

exports.createMemory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, description, image_url, memory_date, category } = req.body;

        if (!title || !memory_date) {
            return res.status(400).json({ error: 'Title and date are required' });
        }

        // Check if user is paired
        const { data: user } = await req.supabase
            .from('users')
            .select('paired_with')
            .eq('id', userId)
            .single();

        if (!user?.paired_with) {
            return res.status(403).json({ error: 'You must be paired to create a memory' });
        }

        const { data: memory, error } = await req.supabase
            .from('memories')
            .insert([{
                created_by: userId,
                title,
                description,
                image_url,
                memory_date,
                category: category || 'everyday'
            }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(memory);

    } catch (error) {
        console.error('Create memory error:', error);
        res.status(500).json({ error: 'Failed to create memory' });
    }
};

exports.deleteMemory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        // Only allow deleting own memories (or strictly enforced by RLS, but double check here)
        const { error } = await req.supabase
            .from('memories')
            .delete()
            .eq('id', id)
            .eq('created_by', userId); // Simple permission check

        if (error) throw error;
        res.json({ message: 'Memory deleted' });

    } catch (error) {
        console.error('Delete memory error:', error);
        res.status(500).json({ error: 'Failed to delete memory' });
    }
};
