// Design Controller
// Handles CRUD operations for card designs

exports.getDesigns = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get all designs for the current user, ordered by most recent
        const { data: designs, error } = await req.supabase
            .from('card_designs')
            .select('*')
            .eq('user_id', userId)
            .order('updated_at', { ascending: false });

        if (error) throw error;

        res.json(designs);

    } catch (error) {
        console.error('Get designs error:', error);
        res.status(500).json({ error: 'Failed to fetch designs' });
    }
};

exports.getDesign = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        // Get specific design (RLS ensures ownership)
        const { data: design, error } = await req.supabase
            .from('card_designs')
            .select('*')
            .eq('id', id)
            .eq('user_id', userId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({ error: 'Design not found' });
            }
            throw error;
        }

        res.json(design);

    } catch (error) {
        console.error('Get design error:', error);
        res.status(500).json({ error: 'Failed to fetch design' });
    }
};

exports.createDesign = async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, design_data } = req.body;

        // Validate design_data structure
        if (!design_data || typeof design_data !== 'object') {
            return res.status(400).json({ error: 'design_data is required and must be an object' });
        }

        // Validate required fields in design_data
        if (!design_data.hasOwnProperty('background') && !design_data.hasOwnProperty('backgroundImage')) {
            return res.status(400).json({ error: 'design_data must have background or backgroundImage' });
        }

        if (!Array.isArray(design_data.elements)) {
            return res.status(400).json({ error: 'design_data.elements must be an array' });
        }

        // Insert new design
        const { data: design, error } = await req.supabase
            .from('card_designs')
            .insert([{
                user_id: userId,
                title: title || 'Untitled Card',
                design_data: design_data,
                is_shared: false
            }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json(design);

    } catch (error) {
        console.error('Create design error:', error);
        res.status(500).json({ error: 'Failed to create design' });
    }
};

exports.updateDesign = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { title, design_data } = req.body;

        // Build update object
        const updates = {};
        if (title !== undefined) updates.title = title;
        if (design_data !== undefined) {
            // Validate design_data if provided
            if (typeof design_data !== 'object') {
                return res.status(400).json({ error: 'design_data must be an object' });
            }
            if (design_data.elements && !Array.isArray(design_data.elements)) {
                return res.status(400).json({ error: 'design_data.elements must be an array' });
            }
            updates.design_data = design_data;
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ error: 'No update fields provided' });
        }

        // Update design (RLS ensures ownership)
        const { data: design, error } = await req.supabase
            .from('card_designs')
            .update(updates)
            .eq('id', id)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({ error: 'Design not found' });
            }
            throw error;
        }

        res.json(design);

    } catch (error) {
        console.error('Update design error:', error);
        res.status(500).json({ error: 'Failed to update design' });
    }
};

exports.deleteDesign = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        // Delete design (RLS ensures ownership)
        const { error } = await req.supabase
            .from('card_designs')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

        if (error) throw error;

        res.json({ message: 'Design deleted successfully' });

    } catch (error) {
        console.error('Delete design error:', error);
        res.status(500).json({ error: 'Failed to delete design' });
    }
};
