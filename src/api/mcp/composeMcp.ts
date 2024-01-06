import axios, { AxiosError } from 'axios';

import { BearerAuth } from '../../utils/functions/createAuthData.js';
import { FortniteProfile, MCPOperation, MCPResponse, ProfileAttributes } from '../../utils/helpers/operationResources.js';
import EpicGamesAPIError, { EpicGamesAPIErrorData } from '../utils/errors/EpicGamesAPIError.js';
import { EpicGamesEndpoints } from '../utils/helpers/constants.js';

const composeMcp = async <T extends ProfileAttributes>(
    auth: BearerAuth,
    profile: keyof typeof FortniteProfile,
    operation: keyof typeof MCPOperation,
    payload = {},
    route = 'client'
) => {
    const { url, params } = createMcpUrl(auth.accountId, route, operation, profile);

    const config = {
        headers: {
            Authorization: `Bearer ${auth.accessToken}`
        },
        params
    };

    try {
        const { data } = await axios.post<MCPResponse<T>>(url, payload, config);
        return data;
    } catch (err: any) {
        const error: AxiosError = err;
        throw new EpicGamesAPIError(err.request, error.response?.data as EpicGamesAPIErrorData, error.response?.status);
    }
};

const createMcpUrl = (
    accountId: string,
    route: string,
    operation: keyof typeof MCPOperation,
    profile: keyof typeof FortniteProfile
) => ({
    url: `${EpicGamesEndpoints.mcp}/${accountId}/${route}/${operation.toString()}`,
    params: { profileId: profile.toString() }
});

export default composeMcp;
