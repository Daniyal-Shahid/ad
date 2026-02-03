-- Function to pair two users safely
CREATE OR REPLACE FUNCTION pair_users(invite_code_input TEXT)
RETURNS JSON AS $$
DECLARE
    partner_id UUID;
    user_id UUID;
    existing_partner UUID;
    my_partner UUID;
BEGIN
    user_id := auth.uid();
    
    -- Find partner by invite code
    SELECT id, paired_with INTO partner_id, existing_partner
    FROM public.users
    WHERE invite_code = invite_code_input;

    IF partner_id IS NULL THEN
        RETURN json_build_object('success', false, 'message', 'Invalid invite code');
    END IF;

    IF partner_id = user_id THEN
        RETURN json_build_object('success', false, 'message', 'You cannot pair with yourself');
    END IF;

    IF existing_partner IS NOT NULL THEN
        RETURN json_build_object('success', false, 'message', 'This user is already paired');
    END IF;

    -- Check if I am already paired
    SELECT paired_with INTO my_partner
    FROM public.users
    WHERE id = user_id;

    IF my_partner IS NOT NULL THEN
        RETURN json_build_object('success', false, 'message', 'You are already paired');
    END IF;

    -- Pair them up
    UPDATE public.users
    SET paired_with = user_id, invite_code = NULL, pairing_date = NOW()
    WHERE id = partner_id;

    UPDATE public.users
    SET paired_with = partner_id, invite_code = NULL, pairing_date = NOW()
    WHERE id = user_id;

    RETURN json_build_object('success', true, 'message', 'Paired successfully', 'partner_id', partner_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
