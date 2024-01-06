import { ApplicationCommandType, EmbedBuilder } from 'discord.js';

import composeMcp from '../api/mcp/composeMcp.js';
import { Color } from '../constants.js';
import { Command } from '../interfaces/Command.js';
import createEmbed from '../utils/commands/createEmbed.js';
import createAuthData from '../utils/functions/createAuthData.js';
import getAvatar from '../utils/functions/getAvatar.js';
import { CoreProfileData } from '../utils/helpers/operationResources.js';

const currencyTypes: Partial<Record<string, string>> = {
    'Currency:MtxComplimentary': 'Epic Games & Refunds',
    'Currency:MtxGiveaway': 'Battlepass & Challenges',
    'Currency:MtxPurchased': 'Purchased'
};

const command: Command = {
    name: 'vbucks',
    description: 'Check v-bucks amount summary.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply();

        const auth = await createAuthData(interaction.user.id);

        if (!auth) {
            await interaction.editReply({ embeds: [createEmbed('info', 'You are not logged in.')] });
            return;
        }

        const coreProfile = await composeMcp<CoreProfileData>(auth, 'common_core', 'QueryProfile');
        const { profile } = coreProfile.profileChanges[0];

        const currency = Object.values(profile.items)
            .filter((v) => v.templateId.startsWith('Currency:Mtx') && v)
            .map((v) => ({
                platform: v.templateId.includes('Purchased')
                    ? `${v.attributes.platform} ${currencyTypes[v.templateId]}`
                    : currencyTypes[v.templateId],
                amount: v.quantity
            }));

        const mtxPlatform = profile.stats.attributes.current_mtx_platform;
        const totalVbucks = currency.reduce((p, a) => p + a.amount, 0);

        const { fulfillmentCounts } = profile.stats.attributes.in_app_purchases;
        const totalSpent = Object.entries(fulfillmentCounts)
            .filter(([k, _]) => k.startsWith('FN_'))
            .map(([k, v]) => parseInt(k.split('_')[1]) * v)
            .reduce((p, v) => p + v, 0);

        const avatarUrl = await getAvatar(interaction.user.id);

        const embed = new EmbedBuilder()
            .setTitle('V-Bucks Summary')
            .setColor(Color.GRAY)
            .setFields(
                {
                    name: 'Platform',
                    value: mtxPlatform,
                    inline: true
                },
                {
                    name: 'Total Spent',
                    value: totalSpent.toLocaleString(),
                    inline: true
                },
                {
                    name: `Amounts - ${totalVbucks.toLocaleString()}`,
                    value: currency.map((c) => `**${c.amount.toLocaleString()}** - ${c.platform}`).join('\n')
                }
            )
            .setFooter({ text: auth.displayName, iconURL: avatarUrl })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    }
};

export default command;
