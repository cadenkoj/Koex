import axios, { AxiosError } from 'axios';

import EpicGamesAPIError, { EpicGamesAPIErrorData } from '../utils/errors/EpicGamesAPIError.js';
import { EpicGamesEndpoints } from '../utils/helpers/constants.js';

export interface MnemonicResponse {
    namespace: string;
    accountId: string;
    creatorName: string;
    mnemonic: string;
    linkType: string;
    metadata: Metadata;
    version: number;
    active: boolean;
    disabled: boolean;
    created: string;
    published: string;
    descriptionTags: string[];
    moderationStatus: string;
}

export interface Metadata {
    parent_set: string;
    image_url: string;
    image_urls: Partial<{
        url_s: string;
        url_xs: string;
        url_m: string;
        url: string;
    }>;
    matchmaking: {
        override_playlist: string;
    };
    video_vuid: string;
}

const getMnemonicMeta = async (accessToken: string, mnemonic: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };

    try {
        const { data } = await axios.get<MnemonicResponse>(`${EpicGamesEndpoints.mnemonic}/${mnemonic}`, config);
        return data;
    } catch (err: any) {
        const error: AxiosError = err;
        throw new EpicGamesAPIError(err.request, error.response?.data as EpicGamesAPIErrorData, error.response?.status);
    }
};

export default getMnemonicMeta;
