import axios, { AxiosError } from 'axios';
import qs from 'qs';

import { EpicGamesEndpoints } from '../utils/helpers/constants.js';
import EpicGamesAPIError, { EpicGamesAPIErrorData } from '../utils/errors/EpicGamesAPIError.js';

type GrantType =
    | 'authorization_code'
    | 'client_credentials'
    | 'device_auth'
    | 'device_code'
    | 'exchange_code'
    | 'external_auth'
    | 'password'
    | 'refresh_token'
    | 'token_to_token';

interface GrantData {
    grant_type: GrantType;
    [key: string]: string;
}

interface OAuthDataResponse {
    access_token: string;
    expires_in: number;
    expires_at: string;
    token_type: string;
    refresh_token: string;
    refresh_expires: number;
    refresh_expires_at: string;
    account_id: string;
    client_id: string;
    internal_client: boolean;
    client_service: string;
    scope: any[];
    displayName: string;
    app: string;
    in_app_id: string;
    device_id?: string;
}

const createOAuthData = async (clientToken: string, grant: GrantData) => {
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${clientToken}`
        }
    };

    try {
        const { data } = await axios.post<OAuthDataResponse>(
            EpicGamesEndpoints.oAuthTokenCreate,
            qs.stringify(grant),
            config
        );
        return data;
    } catch (err: any) {
        const error: AxiosError = err;
        throw new EpicGamesAPIError(err.request, error.response?.data as EpicGamesAPIErrorData, error.response?.status);
    }
};

export default createOAuthData;
