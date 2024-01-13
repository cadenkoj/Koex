import { createClient } from '@supabase/supabase-js';

import { Account, Database } from '../../types/supabase.js';

export const supabase = createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

export const getAccount = async (userId: string) => {
    const { data, error } = await supabase.from('accounts').select('*').match({ user_id: userId }).maybeSingle();

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export const getAllAuths = async (userId: string) => {
    const { data, error } = await supabase.from('accounts').select('*').match({ user_id: userId }).maybeSingle();

    if (error) {
        throw new Error(error.message);
    }

    return data ? data.auths : [];
};

export const saveAccount = async (userId: string, auth: Account) => {
    const accounts = await getAccount(userId);

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

export const setAccounts = async (userId: string, auths?: Account[], active_account_id?: string | null) => {
    const { data, error } = await supabase
        .from('accounts')
        .upsert({ user_id: userId, auths, active_account_id })
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return (data as any).auths;
};

export const getAutoResearchUsers = async () => {
    const { data, error } = await supabase.from('auto_research').select('*');

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export default supabase;
