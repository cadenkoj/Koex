import { ApplicationCommandType, EmbedBuilder } from 'discord.js';

import createExchangeCode from '../api/auth/createExchangeCode.js';
import calderaRequest from '../api/caldera/calderaRequest.js';
import { Color } from '../constants.js';
import { Command } from '../interfaces/Command.js';
import createEmbed from '../utils/commands/createEmbed.js';
import createAuthData from '../utils/functions/createAuthData.js';
import getAvatar from '../utils/functions/getAvatar.js';

const command: Command = {
    name: 'anticheat',
    description: 'Check your anti-cheat provider.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply();

        const auth = await createAuthData(interaction.user.id);

        if (!auth) {
            await interaction.editReply({ embeds: [createEmbed('info', 'You are not logged in.')] });
            return;
        }

        const exchangeCode = await createExchangeCode(auth.accessToken);
        const caldera = await calderaRequest(auth.accountId, exchangeCode);
        const avatarUrl = await getAvatar(interaction.user.id);

        const embed = new EmbedBuilder()
            .setColor(Color.GRAY)
            .setFields({
                name: 'Anti-Cheat',
                value: `Your current anti-cheat provider is **${caldera.provider}**.`
            })
            .setFooter({ text: auth.displayName, iconURL: avatarUrl })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    }
};

export default command;
