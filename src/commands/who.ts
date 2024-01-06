import { ApplicationCommandType, EmbedBuilder } from 'discord.js';

import { Color } from '../constants.js';
import { Command } from '../interfaces/Command.js';
import createEmbed from '../utils/commands/createEmbed.js';
import getAvatar from '../utils/functions/getAvatar.js';
import createAuthData from '../utils/functions/createAuthData.js';

const command: Command = {
    name: 'who',
    description: 'Display your current account.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply();

        const auth = await createAuthData(interaction.user.id);

        if (!auth) {
            await interaction.editReply({ embeds: [createEmbed('info', 'You are not logged in.')] });
            return;
        }

        const avatarUrl = await getAvatar(interaction.user.id);

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: `Hello, ${auth.displayName}`,
                        iconURL: avatarUrl
                    })
                    .setColor(Color.GRAY)
            ]
        });
    }
};

export default command;
