import axios, { AxiosError } from 'axios';

import { EpicGamesEndpoints } from '../utils/helpers/constants.js';
import EpicGamesAPIError, { EpicGamesAPIErrorData } from '../utils/errors/EpicGamesAPIError.js';

interface ExchangeCodeResponse {
    expiresInSeconds: number;
    code: string;
    creatingClientId: string;
}

const createExchangeCode = async (accessToken: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };

    try {
        const { data } = await axios.get<ExchangeCodeResponse>(EpicGamesEndpoints.oAuthTokenExchange, config);
        return data.code;
    } catch (err: any) {
        const error: AxiosError = err;
        throw new EpicGamesAPIError(err.request, error.response?.data as EpicGamesAPIErrorData, error.response?.status);
    }
};

export default createExchangeCode;
