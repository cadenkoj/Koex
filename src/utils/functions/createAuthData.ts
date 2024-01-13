import createOAuthData from '../../api/auth/createOAuthData.js';
import { FORTNITE_GAME_CLIENT } from '../../constants.js';
import { getAccount } from './database.js';

export interface BearerAuth {
    accountId: string;
    accessToken: string;
    displayName: string;
}

const createAuthData = async (userId: string, accountId?: string): Promise<BearerAuth | null> => {
    const accounts = await getAccount(userId);

    if (!accounts) return null;

    const auth = accounts.auths.find((a) => a.accountId === (accountId || accounts.active_account_id));

    if (!auth) return null;

    try {
        const oAuthData = await createOAuthData(FORTNITE_GAME_CLIENT._token, {
            grant_type: 'device_auth',
            account_id: auth.accountId,
            device_id: auth.deviceId,
            secret: auth.secret
        });

        return {
            accountId: oAuthData.account_id,
            accessToken: oAuthData.access_token,
            displayName: oAuthData.displayName
        };
    } catch (error) {
        console.log(error);
        return null;
    }
};

export default createAuthData;
