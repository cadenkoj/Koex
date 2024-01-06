import { createClient } from '@supabase/supabase-js';

import { AccountAuth, Database } from '../../types/supabase.js';

const supabase = createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

export const getAllAccounts = async (userId: string) => {
    const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .match({ user_id: userId })
        .maybeSingle();

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export const getAllAuths = async (userId: string) => {
    const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .match({ user_id: userId })
        .maybeSingle();

    if (error) {
        throw new Error(error.message);
    }

    return data ? data.auths : [];
};

export const getWhitelistedUser = async (userId: string) => {
    const { data, error } = await supabase
        .from('dupe_whitelist')
        .select('*')
        .match({ user_id: userId })
        .maybeSingle();

    if (error) {
        throw new Error(error.message);
    }

    return !!data;
};

export const removeWhitelistedUser = async (userId: string) => {
    const { data, error } = await supabase
        .from('dupe_whitelist')
        .delete()
        .match({ user_id: userId })
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export const saveAccount = async (userId: string, auth: AccountAuth) => {
    const accounts = await getAllAccounts(userId);

    const auths: any[] = accounts?.auths.length ? accounts.auths : [];
    auths.push(auth);

    const { data, error } = await supabase
        .from('accounts')
        .upsert({ user_id: userId, auths, active_account_id: auth.accountId })
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export const setAccounts = async (userId: string, auths?: AccountAuth[], active_account_id?: string | null) => {
    const { data, error } = await supabase
        .from('accounts')
        .upsert({ user_id: userId, auths, active_account_id })
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return (data as any).auths;
};

export const saveWhitelistedUser = async (userId: string) => {
    const { data, error } = await supabase.from('dupe_whitelist').upsert({ user_id: userId }).single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export default supabase;
