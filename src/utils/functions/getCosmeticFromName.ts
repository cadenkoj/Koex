import axios from 'axios';

export interface Response {
    status: number;
    data: CosmeticData;
}

export interface CosmeticData {
    id: string;
    name: string;
    description: string;
    type: Rarity;
    rarity: Rarity;
    series: null;
    set: Set;
    introduction: Introduction;
    images: Images;
    variants: Variant[];
    searchTags: null;
    gameplayTags: string[];
    metaTags: null;
    showcaseVideo: null;
    dynamicPakId: null;
    displayAssetPath: null;
    definitionPath: string;
    path: string;
    added: string;
    shopHistory: null;
}

export interface Images {
    smallIcon: string;
    icon: string;
    featured: string;
    other: null;
}

export interface Introduction {
    chapter: string;
    season: string;
    text: string;
    backendValue: number;
}

export interface Rarity {
    value: string;
    displayValue: string;
    backendValue: string;
}

export interface Set {
    value: string;
    text: string;
    backendValue: string;
}

export interface Variant {
    channel: string;
    type: string;
    options: Option[];
}

export interface Option {
    tag: string;
    name: string;
    image: string;
}

const getCosmeticFromName = async (name: string) => {
    const config = { params: { name } };

    const { data } = await axios.get<Response>('https://fortnite-api.com/v2/cosmetics/br/search', config);
    return data.data;
};

export default getCosmeticFromName;
