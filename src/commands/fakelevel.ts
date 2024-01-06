import { ApplicationCommandOptionType, ApplicationCommandType, AttachmentBuilder, EmbedBuilder } from 'discord.js';

import { Emoji } from '../constants.js';
import getParty from '../api/party/getParty.js';
import sendPartyPatch from '../api/party/sendPartyPatch.js';
import EpicGamesAPIError from '../api/utils/errors/EpicGamesAPIError.js';
import { Color } from '../constants.js';
import { Command } from '../interfaces/Command.js';
import createEmbed from '../utils/commands/createEmbed.js';
import createAuthData from '../utils/functions/createAuthData.js';
import getAvatar from '../utils/functions/getAvatar.js';

const command: Command = {
    name: 'fakelevel',
    description: 'Set your Battle Royale level to any number. (Only visible to others)',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply();

        const level = interaction.options.getInteger('level', true).toString();

        const auth = await createAuthData(interaction.user.id);

        if (!auth) {
            await interaction.editReply({ embeds: [createEmbed('info', 'You are not logged in.')] });
            return;
        }

        const cosmeticUpdate = {
            'Default:AthenaBannerInfo_j': JSON.stringify({
                AthenaBannerInfo: {
                    seasonLevel: level
                }
            })
        };

        const body = {
            delete: [],
            revision: 1,
            update: cosmeticUpdate
        };

        const party = await getParty(auth.accessToken, auth.accountId);

        if (!party.current.length) {
            await interaction.editReply({ embeds: [createEmbed('info', 'You are not in a party.')] });
            return;
        }

        try {
            await sendPartyPatch(auth.accessToken, auth.accountId, party.current[0].id, body);
        } catch (err: any) {
            const error: EpicGamesAPIError = err;

            if (error.code === 'errors.com.epicgames.social.party.stale_revision') {
                body.revision = parseInt(error.messageVars[1], 10);
                await sendPartyPatch(auth.accessToken, auth.accountId, party.current[0].id, body);
            }
        }

        const avatarUrl = await getAvatar(interaction.user.id);
        const thumbnail = new AttachmentBuilder(process.cwd() + '/assets/fortniteXp.png');

        const embed = new EmbedBuilder()
            .setAuthor({ name: 'Fake Level' })
            .setDescription(`${Emoji.CHECK} Successfully set level to **${level}**.`)
            .setThumbnail('attachment://fortniteXp.png')
            .setColor(Color.GREEN)
            .setFooter({ text: auth.displayName, iconURL: avatarUrl })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed], files: [thumbnail] });
    },
    options: [
        {
            name: 'level',
            description: 'The fake level to set your account.',
            required: true,
            type: ApplicationCommandOptionType.Integer,
            min_value: 1,
            max_value: 999
        }
    ]
};

export default command;
