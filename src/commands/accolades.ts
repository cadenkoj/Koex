import { ApplicationCommandType, EmbedBuilder } from 'discord.js';

import { Color, Emoji } from '../constants.js';
import { Command } from '../interfaces/Command.js';
import createEmbed from '../utils/commands/createEmbed.js';
import createAuthData from '../utils/functions/createAuthData.js';
import getAvatar from '../utils/functions/getAvatar.js';
import composeMcp from '../api/mcp/composeMcp.js';
import { CoreProfileData } from '../utils/helpers/operationResources.js';

const command: Command = {
    name: 'accolades',
    description: 'Check your STW accolades.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply();

        const auth = await createAuthData(interaction.user.id);

        if (!auth) {
            await interaction.editReply({ embeds: [createEmbed('info', 'You are not logged in.')] });
            return;
        }

        const campaignProfile = await composeMcp<CoreProfileData>(auth, 'campaign', 'QueryProfile');
        const { profile } = campaignProfile.profileChanges[0];

        const xpItem = Object.values(profile.items).find(v => v.templateId === "Token:stw_accolade_tracker");

        if (!xpItem) {
            await interaction.editReply({ embeds: [createEmbed('info', 'You have no accolades fuck nigga.')] });
            return;
        }

        const lastUpdate = xpItem.attributes ? new Date(xpItem.attributes.last_update) : new Date(0);
        const lastReset = xpItem.attributes ? new Date(xpItem.attributes.last_reset) : new Date(0);
        const today = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
        const lastUpdateDay = Math.floor(lastUpdate.getTime() / (24 * 60 * 60 * 1000));
    
        const outdated = today !== lastUpdateDay;
        const daily: number = xpItem.attributes ? xpItem.attributes.daily_xp : 0;
    
        const avatarUrl = await getAvatar(interaction.user.id);

        const embed = new EmbedBuilder()
            .setColor(Color.GRAY)
            .setTitle(`${auth.displayName}'s STW Accolades ${outdated ? "(Outdated)" : ""}`)
            .setFields({
                name: 'XP Earned Recently',
                value: Emoji.SEASON_XP + " " + daily.toLocaleString()
            },
            {
                name: "Last Update",
                value: lastUpdate.toLocaleDateString("en-US", { timeZone: 'UTC' }) + " " + lastUpdate.toLocaleTimeString("en-US", { timeZone: 'UTC' }) + " UTC"
            },
            {
                name: "Last Reset",
                value: lastReset.toLocaleDateString("en-US", { timeZone: 'UTC' }) + " " + lastUpdate.toLocaleTimeString("en-US", { timeZone: 'UTC' }) + " UTC"
            },
            {
                name: "XP Cap Reached",
                value: daily >= 368000 ? Emoji.CHECK : Emoji.CROSS
            })
            .setFooter({ text: auth.displayName, iconURL: avatarUrl })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    }
};

export default command;
