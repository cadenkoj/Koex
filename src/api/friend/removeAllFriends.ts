import axios from 'axios';

import EpicGamesAPIError, { EpicGamesAPIErrorData } from '../utils/errors/EpicGamesAPIError.js';
import { EpicGamesEndpoints } from '../utils/helpers/constants.js';

const removeAllFriends = async (accessToken: string, accountId: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };

    try {
        await axios.delete(`${EpicGamesEndpoints.friends}/${accountId}/friends`, config);
        return true;
    } catch (error) {
        if (!(error instanceof Error)) throw new Error(String(error));
        if (!axios.isAxiosError(error)) throw new Error(error.message);

        throw new EpicGamesAPIError(
            error.request,
            error.response?.data as EpicGamesAPIErrorData,
            error.response?.status
        );
    }
};

export default removeAllFriends;
