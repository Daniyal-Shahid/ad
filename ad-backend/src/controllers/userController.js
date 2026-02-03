const { createClient } = require('@supabase/supabase-js');
const generateCode = require('../utils/generateCode');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
// We don't need a global supabase client here anymore as we use req.supabase
// const supabase = createClient(supabaseUrl, supabaseKey);

exports.generateInviteCode = async (req, res) => {
    try {
        const userId = req.user.id;

        const { data: user, error: fetchError } = await req.supabase
            .from('users')
            .select('invite_code')
            .eq('id', userId)
            .single();

        if (fetchError) throw fetchError;

        if (user.invite_code) {
            return res.json({ invite_code: user.invite_code });
        }

        let code = generateCode();
        let isUnique = false;

        while (!isUnique) {
            const { data: existing } = await req.supabase
                .from('users')
                .select('id')
                .eq('invite_code', code)
                .maybeSingle(); // Changed from single() to maybeSingle()

            if (!existing) isUnique = true;
            else code = generateCode();
        }

        const { data: updatedUser, error: updateError } = await req.supabase
            .from('users')
            .update({ invite_code: code })
            .eq('id', userId)
            .select('invite_code')
            .single();

        if (updateError) throw updateError;

        res.json({ invite_code: updatedUser.invite_code });

    } catch (error) {
        console.error('Generate code error:', error);
        res.status(500).json({ error: 'Failed to generate code' });
    }
};

exports.pairWithPartner = async (req, res) => {
    const { inviteCode } = req.body;

    if (!inviteCode) return res.status(400).json({ error: 'Invite code is required' });

    try {
        const { data, error } = await req.supabase.rpc('pair_users', {
            invite_code_input: inviteCode.toUpperCase()
        });

        if (error) throw error;

        if (!data.success) {
            return res.status(400).json({ error: data.message });
        }

        // Fetch partner details to return
        // Since we are now paired (or the user is linked), we can fetch the partner's basic info
        // data.partner_id comes from the RPC
        const { data: partner } = await req.supabase
            .from('users')
            .select('id, name')
            .eq('id', data.partner_id)
            .single();

        res.json({ message: data.message, partner });

    } catch (error) {
        console.error('Pairing error:', error);
        res.status(500).json({ error: 'Pairing failed' });
    }
};

exports.unpair = async (req, res) => {
    const userId = req.user.id;

    try {
        const { data: me } = await req.supabase.from('users').select('paired_with').eq('id', userId).single();
        const partnerId = me?.paired_with;

        if (partnerId) {
            await req.supabase.from('users').update({ paired_with: null, pairing_date: null }).eq('id', partnerId);
        }
        await req.supabase.from('users').update({ paired_with: null, pairing_date: null }).eq('id', userId);

        res.json({ message: 'Unpaired successfully' });
    } catch (error) {
        console.error('Unpair error:', error);
        res.status(500).json({ error: 'Unpair failed' });
    }
};
