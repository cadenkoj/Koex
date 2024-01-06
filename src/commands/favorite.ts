import { ApplicationCommandOptionType, ApplicationCommandType } from 'discord.js';

import sendFavoriteRequest from '../api/discovery/sendFavoriteRequest.js';
import EpicGamesAPIError from '../api/utils/errors/EpicGamesAPIError.js';
import { Command } from '../interfaces/Command.js';
import createEmbed from '../utils/commands/createEmbed.js';
import createAuthData from '../utils/functions/createAuthData.js';

const command: Command = {
    name: 'favorite',
    description: 'Favorite a playlist by ID.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply();

        const auth = await createAuthData(interaction.user.id);

        if (!auth) {
            await interaction.editReply({ embeds: [createEmbed('info', 'You are not logged in.')] });
            return;
        }

        const playlistId = interaction.options.getString('playlist', true).toLowerCase();

        try {
            await sendFavoriteRequest(auth.accessToken, auth.accountId, playlistId);
        } catch (error) {
            if (
                error instanceof EpicGamesAPIError &&
                error.code === 'errors.com.epicgames.discovery.invalid_link_code'
            ) {
                await interaction.editReply({
                    embeds: [createEmbed('info', `Invalid Playlist ID or Island Code **${playlistId}**.`)]
                });
            }
        }

        await interaction.editReply({
            embeds: [createEmbed('success', `Added **${playlistId}** to your favorites.`)]
        });
    },
    options: [
        {
            name: 'playlist',
            description: 'The playlist to favorite.',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ]
};

export default command;
