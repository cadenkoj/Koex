import { ApplicationCommandOptionType, ApplicationCommandType, EmbedBuilder } from 'discord.js';

import getMnemonicMeta from '../api/discovery/getMnemonicMeta.js';
import EpicGamesAPIError from '../api/utils/errors/EpicGamesAPIError.js';
import { Color } from '../constants.js';
import { Command } from '../interfaces/Command.js';
import createEmbed from '../utils/commands/createEmbed.js';
import createAuthData from '../utils/functions/createAuthData.js';
import getPlaylistsFromName, { PlaylistData } from '../utils/functions/getPlaylistFromName.js';

const command: Command = {
    name: 'playlist-info',
    description: 'Search through playlists by name.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply();

        const auth = await createAuthData(interaction.user.id);

        if (!auth) {
            await interaction.editReply({ embeds: [createEmbed('info', 'You are not logged in.')] });
            return;
        }

        const playlistName = interaction.options.getString('name', true);

        let playlist: PlaylistData | undefined = undefined;

        try {
            playlist = await getPlaylistsFromName(playlistName);
        } catch (error) {
            if (error instanceof Error) {
                await interaction.editReply({
                    embeds: [createEmbed('info', error.message)]
                });
                return;
            }
        }

        if (!playlist) {
            await interaction.editReply({
                embeds: [createEmbed('info', 'Failed to retrieve playlist information.')]
            });
            return;
        }

        let isDisabled = false;
        try {
            const meta = await getMnemonicMeta(auth.accessToken, playlist.id.toLowerCase());
            isDisabled = meta.disabled;
        } catch (error) {
            if (error instanceof EpicGamesAPIError && error.code === 'errors.com.epicgames.links.link_disabled') {
                isDisabled = true;
            }
        }

        const embed = new EmbedBuilder()
            .setAuthor({ name: playlist.name! })
            .setColor(Color.GRAY)
            .setFields({
                name: 'Description',
                value: playlist.description ?? 'No description provided.'
            })
            .setImage(playlist.images.showcase)
            .setFooter({ text: playlist.id });

        if (playlist.subName) {
            embed.addFields({
                name: 'Team Mode',
                value: playlist.subName,
                inline: true
            });
        }

        embed.addFields({
            name: 'Disabled',
            value: isDisabled ? 'Yes' : 'No',
            inline: true
        });

        await interaction.editReply({ embeds: [embed] });
    },
    options: [
        {
            name: 'name',
            description: 'The name of the playlist.',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ]
};

export default command;
