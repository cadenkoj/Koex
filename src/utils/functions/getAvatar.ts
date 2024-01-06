import axios, { AxiosError } from 'axios';

import EpicGamesAPIError, { EpicGamesAPIErrorData } from '../../api/utils/errors/EpicGamesAPIError.js';
import { EpicGamesEndpoints } from '../../api/utils/helpers/constants.js';
import createAuthData, { BearerAuth } from './createAuthData.js';

export interface AvatarResponse {
    accountId: string;
    namespace: string;
    avatarId: string;
}

const getAvatar = async (userId: string, authOverride?: BearerAuth, cosmeticOverride?: string) => {
    const auth = authOverride ?? (await createAuthData(userId));

    if (!auth) throw new Error('Failed to create authorization data');

    const config = {
        headers: {
            Authorization: `Bearer ${auth.accessToken}`
        },
        params: {
            accountIds: auth.accountId
        }
    };

    try {
        const { data } = await axios.get<AvatarResponse[]>(EpicGamesEndpoints.accountAvatars, config);
        let cosmeticId = 'CID_001_Athena_Commando_F_Default';

        if (data.length && data[0].avatarId.length) cosmeticId = data[0].avatarId.replace(/AthenaCharacter:/i, '');

        return createCosmeticUrl(cosmeticId);
    } catch (err: any) {
        const error: AxiosError = err;
        throw new EpicGamesAPIError(err.request, error.response?.data as EpicGamesAPIErrorData, error.response?.status);
    }
};

export const createCosmeticUrl = (cosmeticId: string) =>
    `https://fortnite-api.com/images/cosmetics/br/${cosmeticId}/icon.png`;

export default getAvatar;
