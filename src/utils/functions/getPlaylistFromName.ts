import axios from 'axios';

export interface Response {
    status: number;
    data: PlaylistData[];
}

export interface PlaylistData {
    id: string;
    name: string | null;
    subName: string | null;
    description: string | null;
    gameType: string;
    ratingType: string | null;
    minPlayers: number;
    maxPlayers: number;
    maxTeams: number;
    maxTeamSize: number;
    maxSquads: number;
    maxSquadSize: number;
    isDefault: boolean;
    isTournament: boolean;
    isLimitedTimeMode: boolean;
    isLargeTeamGame: boolean;
    accumulateToProfileStats: boolean;
    images: {
        showcase: string | null;
        missionIcon: string | null;
    };
    gameplayTags: string[];
    path: string;
    added: Date;
}

const getPlaylistsFromName = async (name: string) => {
    const config = { params: { name } };

    const { data } = await axios.get<Response>('https://fortnite-api.com/v1/playlists', config);

    const playlists = Object.values(data.data).filter((p) => p.name && p.name.toLowerCase() === name.toLowerCase());
    const showcasePlaylist = playlists.filter((p) => p.images.showcase)[0];

    if (!playlists.length) throw new Error('Invalid Playlist Name');

    return showcasePlaylist ?? playlists[0];
};

export default getPlaylistsFromName;
