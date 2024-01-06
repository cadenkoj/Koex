import { ApplicationCommandOptionType, ApplicationCommandType, AttachmentBuilder, EmbedBuilder } from 'discord.js';

import { Emoji } from '../constants.js';
import sendPartyPatch from '../api/party/sendPartyPatch.js';
import getParty from '../api/party/getParty.js';
import EpicGamesAPIError from '../api/utils/errors/EpicGamesAPIError.js';
import { Color } from '../constants.js';
import { Command } from '../interfaces/Command.js';
import createEmbed from '../utils/commands/createEmbed.js';
import createAuthData from '../utils/functions/createAuthData.js';
import getAvatar from '../utils/functions/getAvatar.js';

const command: Command = {
    name: 'fakecrownwins',
    description: 'Set your Royal Royale count to any number. (Only visible to others)',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply();

        const crowns = interaction.options.getInteger('crowns', true).toString();

        const auth = await createAuthData(interaction.user.id);

        if (!auth) {
            await interaction.editReply({ embeds: [createEmbed('info', 'You are not logged in.')] });
            return;
        }

        const cosmeticUpdate = {
            'Default:AthenaCosmeticLoadout_j': JSON.stringify({
                AthenaCosmeticLoadout: {
                    cosmeticStats: [
                        {
                            statName: 'TotalVictoryCrowns',
                            statValue: crowns
                        },
                        {
                            statName: 'TotalRoyalRoyales',
                            statValue: crowns
                        },
                        {
                            statName: 'HasCrown',
                            statValue: 1
                        }
                    ]
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
        const thumbnail = new AttachmentBuilder(process.cwd() + '/assets/fortniteCrown.png');

        const embed = new EmbedBuilder()
            .setAuthor({ name: 'Fake Crown Wins' })
            .setColor(Color.GREEN)
            .setDescription(`${Emoji.CHECK} Successfully set crowns to **${crowns}**.`)
            .setFooter({ text: auth.displayName, iconURL: avatarUrl })
            .setThumbnail('attachment://fortniteCrown.png')
            .setTimestamp();

        await interaction.editReply({ embeds: [embed], files: [thumbnail] });
    },
    options: [
        {
            name: 'crowns',
            description: 'The name of the cosmetic to equip.',
            required: true,
            type: ApplicationCommandOptionType.Integer,
            min_value: 0,
            max_value: 99999
        }
    ]
};

export default command;
