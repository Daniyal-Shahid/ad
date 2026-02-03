const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
// const supabase = createClient(supabaseUrl, supabaseKey);

exports.createInvitation = async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, vibe, date_time, location, activity, personal_message, photo } = req.body;

        // Fetch user to get partner ID
        const { data: user } = await req.supabase.from('users').select('paired_with').eq('id', userId).single();
        const partnerId = user?.paired_with;

        if (!partnerId) {
            return res.status(400).json({ error: 'You must be paired to send an invitation' });
        }

        const { data: invitation, error } = await req.supabase
            .from('date_invitations')
            .insert([{
                sender_id: userId,
                recipient_id: partnerId,
                title,
                vibe,
                date_time,
                location,
                activity,
                personal_message,
                photo,
                status: 'pending'
            }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(invitation);

    } catch (error) {
        console.error('Create invitation error:', error);
        res.status(500).json({ error: 'Failed to create invitation' });
    }
};

exports.getInvitations = async (req, res) => {
    try {
        const userId = req.user.id;

        // simple fetch all involved invitations
        const { data: invitations, error } = await req.supabase
            .from('date_invitations')
            .select('*, sender:sender_id(name, avatar_url)')
            .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(invitations);

    } catch (error) {
        console.error('Get invitations error:', error);
        res.status(500).json({ error: 'Failed to fetch invitations' });
    }
};

exports.respondToInvitation = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { status, response_message } = req.body; // status: 'accepted' | 'declined'

        if (!['accepted', 'declined'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const { data, error } = await req.supabase
            .from('date_invitations')
            .update({
                status,
                response_message,
                responded_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('recipient_id', userId) // Ensure only recipient can respond
            .select()
            .single();

        if (error) throw error;
        res.json(data);

    } catch (error) {
        console.error('Respond invitation error:', error);
        res.status(500).json({ error: 'Failed to respond to invitation' });
    }
};
