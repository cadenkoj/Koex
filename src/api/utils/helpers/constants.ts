export const EpicGamesServices = Object.freeze({
    accountService: 'https://account-public-service-prod03.ol.epicgames.com',
    avatarService: 'https://avatar-service-prod.identity.live.on.epicgames.com',
    calderaService: 'https://caldera-service-prod.ecosec.on.epicgames.com',
    discoveryService: 'https://fn-service-discovery-live-public.ogs.live.on.epicgames.com',
    friendsService: 'https://friends-public-service-prod.ol.epicgames.com',
    fortniteService: 'https://fortnite-public-service-prod11.ol.epicgames.com',
    lightswitchService: 'https://lightswitch-public-service-prod06.ol.epicgames.com',
    linksService: 'https://links-public-service-live.ol.epicgames.com',
    partyService: 'https://party-service-prod.ol.epicgames.com',
    statsService: 'https://statsproxy-public-service-live.ol.epicgames.com',
    userSearchService: 'https://user-search-service-prod.ol.epicgames.com'
});

export const EpicGamesEndpoints = Object.freeze({
    // OAuth
    oAuth: EpicGamesServices.accountService + '/account/api/oauth',
    oAuthTokenCreate: EpicGamesServices.accountService + '/account/api/oauth/token',
    oAuthTokenDelete: EpicGamesServices.accountService + '/account/api/oauth/sessions/kill',
    oAuthTokenExchange: EpicGamesServices.accountService + '/account/api/oauth/exchange',
    oAuthTokenVerify: EpicGamesServices.accountService + '/account/api/oauth/verify',
    oAuthDeviceCode: EpicGamesServices.accountService + '/account/api/oauth/deviceAuthorization',
    oAuthDeviceAuth: EpicGamesServices.accountService + '/account/api/public/account',
    // Account
    accountAvatars: EpicGamesServices.avatarService + '/v1/avatar/fortnite/ids',
    accountDisplayName: EpicGamesServices.accountService + '/account/api/public/account/displayName',
    accountEmail: EpicGamesServices.accountService + '/account/api/public/account/email',
    accountId: EpicGamesServices.accountService + '/account/api/public/account',
    userSearch: EpicGamesServices.userSearchService + '/api/v1/search',
    // Caldera
    caldera: EpicGamesServices.calderaService + '/caldera/api/v1/launcher/racp',
    // Fortnite
    fortniteStatus: EpicGamesServices.lightswitchService + '/lightswitch/api/service/bulk/status?serviceId=Fortnite',
    fortniteCatalog: EpicGamesServices.fortniteService + '/fortnite/api/storefront/v2/catalog',
    eventFlags: EpicGamesServices.fortniteService + '/fortnite/api/calendar/v1/timeline',
    mcp: EpicGamesServices.fortniteService + '/fortnite/api/game/v2/profile',
    creative: EpicGamesServices.fortniteService + '/fortnite/api/game/v2/creative',
    fortniteParty: EpicGamesServices.partyService + '/party/api/v1/Fortnite',
    discovery: EpicGamesServices.discoveryService + '/api/v1',
    mnemonic: EpicGamesServices.linksService + '/links/api/fn/mnemonic',
    // Battle Royale
    brStats: EpicGamesServices.statsService + '/statsproxy/api/statsv2',
    brInventory: EpicGamesServices.fortniteService + '/fortnite/api/game/v2/br-inventory/account',
    // Friends
    friends: EpicGamesServices.friendsService + '/friends/api/v1',
    friendsBlock: EpicGamesServices.friendsService + '/friends/api/public/blocklist'
});
