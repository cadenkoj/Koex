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
    CHECK = '<:KX_Check:1017236824621596732>',
    CROSS = '<:KX_Cross:1017236826223808602>',
    INFO = '<:KX_Info:1017236827507265547>',
    FORTITUDE = '<:KX_Fortitude:1020093151572148365>',
    RESISTANCE = '<:KX_Resistance:1020093154562678794>',
    OFFENSE = '<:KX_Offense:1020093155632222209>',
    TECHNOLOGY = '<:KX_Technology:1020093152939487273>',
    PLAYS_WELL_WITH_OTHERS = '<:KX_PlaysWellWithOthers:1020554390668574741>',
    GUARDIAN_ANGEL = '<:KX_GuardianAngel:1020554389485781052>',
    LOOT_LEGEND = '<:KX_LootLegend:1020554387661279252>',
    GO_GNOME = '<:KX_GoGnome:1020554386323292160>',
    UNSPEAKABLE_HORRORS = '<:KX_UnspeakableHorrors:1020554384846888990>',
    TALENTED_BUILDER = '<:KX_TalentedBuilder:1020554382959464460>'
}

const [_id, _secret] = ['3446cd72694c4a4485d81b77adbb2141', '9209d4a5e25a457fb9b07489d313b41a'];
export const FORTNITE_GAME_CLIENT = Object.freeze({
    _name: 'fortniteIOSGameClient',
    _id,
    _secret,
    _token: Buffer.from(_id + ':' + _secret).toString('base64')
});

export const IS_PROD = process.env.NODE_ENV === 'production';
