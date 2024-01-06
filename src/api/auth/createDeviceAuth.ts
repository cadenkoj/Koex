import axios, { AxiosError } from 'axios';

import { EpicGamesEndpoints } from '../utils/helpers/constants.js';
import EpicGamesAPIError, { EpicGamesAPIErrorData } from '../utils/errors/EpicGamesAPIError.js';

interface DeviceAuthResponse {
    accountId: string;
    deviceId: string;
    secret: string;
}

const createDeviceAuth = async (accessToken: string, accountId: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };

    try {
        const { data } = await axios.post<DeviceAuthResponse>(
            `${EpicGamesEndpoints.oAuthDeviceAuth}/${accountId}/deviceAuth`,
            {},
            config
        );
        return {
            accountId: data.accountId,
            deviceId: data.deviceId,
            secret: data.secret
        };
    } catch (err: any) {
        const error: AxiosError = err;
        throw new EpicGamesAPIError(err.request, error.response?.data as EpicGamesAPIErrorData, error.response?.status);
    }
};

export default createDeviceAuth;
