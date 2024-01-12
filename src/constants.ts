export enum Color {
    RED = '#FA4459',
    ORANGE = '#F8602C',
    YELLOW = '#fadc44',
    GREEN = '#04d46c',
    BLUE = '#44a8fa',
    PINK = '#f37ffe',
    GRAY = '#2f3136'
}

export enum Emoji {
    CHECK = '<:KX_Check:1195134674805194762>',
    CROSS = '<:KX_Cross:1195134673727275180>',
    REPLY = '<:KX_Reply:1195144652546908200>',
    FORTITUDE = '<:KX_Fortitude:1195134671604961370>',
    GO_GNOME = '<:KX_GoGnome:1195134820599205938>',
    GUARDIAN_ANGEL = '<:KX_GuardianAngel:1195134680710791199>',
    INFO = '<:KX_Info:1195134672624177204>',
    LOOT_LEGEND = '<:KX_LootLegend:1195134755805610044>',
    OFFENSE = '<:KX_Offense:1195134669801390190>',
    PLAYS_WELL_WITH_OTHERS = '<:KX_PlaysWellWithOthers:1195134756556390543>',
    RESISTANCE = '<:KX_Resistance:1195134754614411315>',
    SEASON_XP = '<:KX_SeasonXP:1195133854390960149>',
    TALENTED_BUILDER = '<:KX_TalentedBuilder:1195134676155777157>',
    TECHNOLOGY = '<:KX_Technology:1195134753259659294>',
    UNSPEAKABLE_HORRORS = '<:KX_UnspeakableHorrors:1195134677300826263>',
    WORLD_EXPLORER = '<:KX_WorldExplorer:1195138550858002573>'
}

const [_id, _secret] = ['3446cd72694c4a4485d81b77adbb2141', '9209d4a5e25a457fb9b07489d313b41a'];
export const FORTNITE_GAME_CLIENT = Object.freeze({
    _name: 'fortniteIOSGameClient',
    _id,
    _secret,
    _token: Buffer.from(_id + ':' + _secret).toString('base64')
});

export const IS_PROD = process.env.NODE_ENV === 'production';
