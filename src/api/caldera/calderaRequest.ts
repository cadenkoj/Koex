import axios, { AxiosError } from 'axios';

import { EpicGamesEndpoints } from '../utils/helpers/constants.js';
import EpicGamesAPIError, { EpicGamesAPIErrorData } from '../utils/errors/EpicGamesAPIError.js';

interface CalderaResponse {
    jwt: string;
    provider: 'EasyAntiCheat' | 'BattlEye';
}

const calderaRequest = async (accountId: string, exchangeCode: string) => {
    const body = {
        account_id: accountId,
        exchange_code: exchangeCode,
        test_mode: false,
        epic_app: 'fortnite',
        nvidia: false
    };

    try {
        const { data } = await axios.post<CalderaResponse>(EpicGamesEndpoints.caldera, body);
        return data;
    } catch (err: any) {
        const error: AxiosError = err;
        throw new EpicGamesAPIError(err.request, error.response?.data as EpicGamesAPIErrorData, error.response?.status);
    }
};

export default calderaRequest;
