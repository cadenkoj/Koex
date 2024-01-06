import { EmbedBuilder } from 'discord.js';

import composeMcp from '../../api/mcp/composeMcp.js';
import createAuthData, { BearerAuth } from '../functions/createAuthData.js';
import { getWhitelistedUser } from '../functions/database.js';
import { CampaignProfileData } from '../helpers/operationResources.js';
import createEmbed from './createEmbed.js';

const toggleDupe = async (
    enable: boolean,
    userId: string,
    authOverride?: BearerAuth,
    bypassWhitelist?: boolean
): Promise<EmbedBuilder> => {
    const isWhitelisted = await getWhitelistedUser(userId);

    if (!isWhitelisted && !bypassWhitelist) throw new Error('(∩ ^-^)⊃━☆ﾟ.*･｡ﾟ');

    const auth = authOverride ?? (await createAuthData(userId));

    if (!auth) return createEmbed('info', `${authOverride ? 'User' : 'You'} been logged out.`);

    const targetProfile = await composeMcp(auth, enable ? 'theater0' : 'outpost0', 'QueryProfile');

    const itemTypes = [
        'Weapon:buildingitemdata_wall',
        'Weapon:buildingitemdata_floor',
        'Weapon:buildingitemdata_stair_w',
        'Weapon:buildingitemdata_roofs'
    ];

    const profileItems = targetProfile.profileChanges[0].profile.items;
    const transferOperations = Object.entries(profileItems)
        .filter(([, v]) => itemTypes.includes(v.templateId))
        .map(([k]) => ({
            itemId: k,
            quantity: 1,
            toStorage: enable ? 'True' : 'False',
            newItemIdHint: 'molleja'
        }));

    if (!transferOperations.length) return createEmbed('info', `Dupe is already ${enable ? 'enabled' : 'disabled'}.`);

    await composeMcp<CampaignProfileData>(auth, 'theater0', 'StorageTransfer', {
        transferOperations
    });

    return createEmbed('success', `Successfully ${enable ? 'enabled' : 'disabled'} the dupe.`);
};

export default toggleDupe;
