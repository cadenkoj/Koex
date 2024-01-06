import axios, { AxiosError } from 'axios';

import EpicGamesAPIError, { EpicGamesAPIErrorData } from '../utils/errors/EpicGamesAPIError.js';
import { EpicGamesEndpoints } from '../utils/helpers/constants.js';
import { PartialFriend } from '../utils/helpers/interfaces.js';

const getOutgoingRequests = async (accessToken: string, accountId: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };

    try {
        const { data } = await axios.get<PartialFriend[]>(
            `${EpicGamesEndpoints.friends}/${accountId}/outgoing`,
            config
        );
        console.log(data);
        return data;
    } catch (err: any) {
        const error: AxiosError = err;
        throw new EpicGamesAPIError(err.request, error.response?.data as EpicGamesAPIErrorData, error.response?.status);
    }
};

export default getOutgoingRequests;
