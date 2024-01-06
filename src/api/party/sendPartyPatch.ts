import axios, { AxiosError } from 'axios';

import { EpicGamesEndpoints } from '../utils/helpers/constants.js';
import EpicGamesAPIError, { EpicGamesAPIErrorData } from '../utils/errors/EpicGamesAPIError.js';

interface PartyMeta {
    delete: any[];
    revision: number;
    update: any;
}

const sendPartyPatch = async (accessToken: string, accountId: string, partyId: string, body: PartyMeta) => {
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };

    try {
        const { data } = await axios.patch(
            `${EpicGamesEndpoints.fortniteParty}/parties/${partyId}/members/${accountId}/meta`,
            body,
            config
        );
        return data;
    } catch (err: any) {
        const error: AxiosError = err;
        throw new EpicGamesAPIError(err.request, error.response?.data as EpicGamesAPIErrorData, error.response?.status);
    }
};

export default sendPartyPatch;
