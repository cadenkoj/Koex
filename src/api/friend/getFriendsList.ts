import axios, { AxiosError } from 'axios';

import EpicGamesAPIError, { EpicGamesAPIErrorData } from '../utils/errors/EpicGamesAPIError.js';
import { EpicGamesEndpoints } from '../utils/helpers/constants.js';
import { Friend, PartialFriend } from '../utils/helpers/interfaces.js';

interface FriendSummaryResponse {
    friends: Friend[];
    incoming: PartialFriend[];
    outgoing: PartialFriend[];
    blocklist: { accountId: string }[];
    settings: {
        acceptInvites: 'string';
        mutualPrivacy: string;
    };
    limitsReached: {
        incoming: boolean;
        outgoing: boolean;
        accepted: boolean;
    };
}

const getFriendSummary = async (accessToken: string, accountId: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        params: {
            displayNames: true
        }
    };

    try {
        const { data } = await axios.get<FriendSummaryResponse>(
            `${EpicGamesEndpoints.friends}/${accountId}/summary`,
            config
        );
        return data;
    } catch (err: any) {
        const error: AxiosError = err;
        throw new EpicGamesAPIError(err.request, error.response?.data as EpicGamesAPIErrorData, error.response?.status);
    }
};

export default getFriendSummary;
