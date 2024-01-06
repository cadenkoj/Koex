import { ActionRowBuilder, ApplicationCommandType, ButtonBuilder, ButtonStyle } from 'discord.js';

import createExchangeCode from '../api/auth/createExchangeCode.js';
import { Command } from '../interfaces/Command.js';
import createAuthData from '../utils/functions/createAuthData.js';
import createEmbed from '../utils/commands/createEmbed.js';

const command: Command = {
    name: 'account-page',
    description: 'Generates a direct link to your account page.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const auth = await createAuthData(interaction.user.id);

        if (!auth) {
            await interaction.editReply({ embeds: [createEmbed('info', 'You are not logged in.')] });
            return;
        }

        const exchangeCode = await createExchangeCode(auth.accessToken);
        const url = 'https://epicgames.com/id/exchange?exchangeCode=' + exchangeCode;
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder().setLabel('Epic Games').setURL(url).setStyle(ButtonStyle.Link)
        );

        await interaction.editReply({ components: [row] });
    }
};

export default command;
