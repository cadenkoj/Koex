import { ApplicationCommandOptionType, ApplicationCommandType, EmbedBuilder } from 'discord.js';
import axios from 'axios';

import getParty from '../api/party/getParty.js';
import sendPartyPatch from '../api/party/sendPartyPatch.js';
import EpicGamesAPIError from '../api/utils/errors/EpicGamesAPIError.js';
import { Color } from '../constants.js';
import { Command } from '../interfaces/Command.js';
import createEmbed from '../utils/commands/createEmbed.js';
import createAuthData from '../utils/functions/createAuthData.js';
import getAvatar, { createCosmeticUrl } from '../utils/functions/getAvatar.js';
import getCosmeticFromName, { CosmeticData } from '../utils/functions/getCosmeticFromName.js';
import { Emoji } from './../constants.js';

const command: Command = {
    name: 'ghostequip',
    description: 'Equip any cosmetic in the Battle Royale lobby. (Only visible to others)',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply();

        const type = interaction.options.getString('type', true);
        const name = interaction.options.getString('name', true);

        const auth = await createAuthData(interaction.user.id);

        if (!auth) {
            await interaction.editReply({ embeds: [createEmbed('info', 'You are not logged in.')] });
            return;
        }

        let cosmetic: CosmeticData | undefined = undefined;

        try {
            cosmetic = await getCosmeticFromName(name);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                await interaction.editReply({
                    embeds: [createEmbed('info', `The cosmetic **${name}** does not exist.`)]
                });
                return;
            }
        }

        if (!cosmetic) {
            await interaction.editReply({ embeds: [createEmbed('info', `Failed to retrieve cosmetic **${name}**.`)] });
            return;
        }

        const loadout = JSON.stringify({
            AthenaCosmeticLoadout: {
                characterDef:
                    type === 'outfit'
                        ? `/Game/Athena/Items/Cosmetics/Characters/${cosmetic.id}.${cosmetic.id}`
                        : undefined,
                backpackDef:
                    type === 'backpack'
                        ? `/Game/Athena/Items/Cosmetics/Backpacks/${cosmetic.id}.${cosmetic.id}`
                        : undefined,
                pickaxeDef:
                    type === 'pickaxe'
                        ? `/Game/Athena/Items/Cosmetics/Pickaxes/${cosmetic.id}.${cosmetic.id}`
                        : undefined
            }
        });

        const emote = JSON.stringify({
            FrontendEmote: {
                emoteItemDef: `/Game/Athena/Items/Cosmetics/Dances/${cosmetic.id}.${cosmetic.id}`,
                emoteSection: -2
            }
        });

        const cosmeticUpdate = {};

        if (type === 'emote') Object.assign(cosmeticUpdate, { 'Default:FrontendEmote_j': emote });
        else Object.assign(cosmeticUpdate, { 'Default:AthenaCosmeticLoadout_j': loadout });

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

        const cosmeticIconUrl = createCosmeticUrl(cosmetic.id);
        const avatarUrl = await getAvatar(interaction.user.id);

        const embed = new EmbedBuilder()
            .setAuthor({ name: 'Ghost Equip' })
            .setDescription(`${Emoji.CHECK} Successfully equipped **${cosmetic.name}**.`)
            .setThumbnail(cosmeticIconUrl)
            .setColor(Color.GREEN)
            .setFooter({ text: auth.displayName, iconURL: avatarUrl })
            .setTimestamp();

        await interaction.editReply({
            embeds: [embed]
        });
    },
    options: [
        {
            name: 'type',
            description: 'The type of cosmetic to equip.',
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: [
                {
                    name: 'Outfit',
                    value: 'outfit'
                },
                {
                    name: 'Backpack',
                    value: 'backpack'
                },
                {
                    name: 'Emote',
                    value: 'emote'
                },
                {
                    name: 'Pickaxe',
                    value: 'pickaxe'
                }
            ]
        },
        {
            name: 'name',
            description: 'The name of the cosmetic to equip.',
            required: true,
            type: ApplicationCommandOptionType.String
        }
    ]
};

export default command;
