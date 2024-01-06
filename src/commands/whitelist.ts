import { ApplicationCommandOptionType, ApplicationCommandType } from 'discord.js';

import { Command } from '../interfaces/Command.js';
import createEmbed from '../utils/commands/createEmbed.js';
import { getWhitelistedUser, removeWhitelistedUser, saveWhitelistedUser } from '../utils/functions/database.js';

const command: Command = {
    name: 'whitelist',
    description: 'Toggle whitelist status for a user.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        if (!['951989622236397590', '569212600785567777', '970421067543871491'].includes(interaction.user.id)) {
            await interaction.editReply({
                embeds: [createEmbed('info', 'You do not have permission to use this command.')]
            });
            return;
        }

        const userId = interaction.options.getString('user-id', true);

        const isWhitelisted = await getWhitelistedUser(userId);

        switch (isWhitelisted) {
            case true:
                await removeWhitelistedUser(userId);
                break;
            case false:
                await saveWhitelistedUser(userId);
                break;
        }

        await interaction.editReply({
            embeds: [
                createEmbed(
                    'success',
                    `Toggled whitelist status for \`${userId}\` to **${isWhitelisted ? 'Off' : 'On'}**.`
                )
            ]
        });
    },
    options: [
        {
            name: 'user-id',
            description: 'The ID of the target user.',
            required: true,
            type: ApplicationCommandOptionType.String
        }
    ]
};

export default command;
