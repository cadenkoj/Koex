import axios, { AxiosError } from 'axios';
import qs from 'qs';

import { EpicGamesEndpoints } from '../utils/helpers/constants.js';
import EpicGamesAPIError, { EpicGamesAPIErrorData } from '../utils/errors/EpicGamesAPIError.js';

export interface AccountData {
    id: string;
    displayName: string;
    externalAuths?: any;
    name?: string;
    email?: string;
    failedLoginAttempts?: number;
    lastLogin?: Date;
    numberOfdisplayNameChanges?: number;
    ageGroup?: string;
    headless?: boolean;
    country?: string;
    lastName?: string;
    preferredLanguage?: string;
    links?: any;
    lastdisplayNameChange?: Date;
    canUpdatedisplayName?: boolean;
    tfaEnabled?: boolean;
    emailVerified?: boolean;
    minorVerified?: boolean;
    minorExpected?: boolean;
    minorStatus?: string;
    cabinedModev: boolean;
}

const getFromAccountIds = async (accessToken: string, accountIds: string[]) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
        },
        params: {
            accountId: accountIds
        },
        paramsSerializer: (params: any) => {
            return qs.stringify(params, { indices: false });
        }
    };

    try {
        const { data } = await axios.get<AccountData[]>(EpicGamesEndpoints.accountId, config);
        return data;
    } catch (err: any) {
        const error: AxiosError = err;
        throw new EpicGamesAPIError(err.request, error.response?.data as EpicGamesAPIErrorData, error.response?.status);
    }
};

export default getFromAccountIds;
