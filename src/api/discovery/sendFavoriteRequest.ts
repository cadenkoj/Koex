import axios, { AxiosError } from 'axios';

import EpicGamesAPIError, { EpicGamesAPIErrorData } from '../utils/errors/EpicGamesAPIError.js';
import { EpicGamesEndpoints } from '../utils/helpers/constants.js';

const sendFavoriteRequest = async (accessToken: string, accountId: string, playlistId: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };

    try {
        const { data } = await axios.post(
            `${EpicGamesEndpoints.discovery}/links/favorites/${accountId}/${playlistId}`,
            {},
            config
        );
        return data;
    } catch (err: any) {
        const error: AxiosError = err;
        throw new EpicGamesAPIError(err.request, error.response?.data as EpicGamesAPIErrorData, error.response?.status);
    }
};

export default sendFavoriteRequest;
