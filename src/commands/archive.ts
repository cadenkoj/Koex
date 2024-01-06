import axios from 'axios';
import { ApplicationCommandOptionType, ApplicationCommandType } from 'discord.js';

import composeMcp from '../api/mcp/composeMcp.js';
import { Command } from '../interfaces/Command.js';
import createEmbed from '../utils/commands/createEmbed.js';
import createAuthData from '../utils/functions/createAuthData.js';
import getCosmeticFromName, { CosmeticData } from '../utils/functions/getCosmeticFromName.js';
import { AthenaProfileData } from '../utils/helpers/operationResources.js';

const command: Command = {
    name: 'archive',
    description: 'Archive a Battle Royale cosmetic.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply();

        const name = interaction.options.getString('name', true);
        const change = interaction.options.getString('change', true);

        const isArchived = change === 'Archived';

        const auth = await createAuthData(interaction.user.id);

        if (!auth) {
            await interaction.editReply({ embeds: [createEmbed('info', 'You are not logged in.')] });
            return;
        }

        const athenaProfile = await composeMcp<AthenaProfileData>(auth, 'athena', 'QueryProfile');

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

        const items = athenaProfile.profileChanges[0].profile.items;

        const cosmeticId: string | undefined = Object.entries(items)
            .filter(([_, v]) => v.templateId.includes(cosmetic!.id.toLowerCase()))
            .map(([k, _]) => k)[0];

        if (!cosmeticId) {
            await interaction.editReply({ embeds: [createEmbed('info', `You don't own **${cosmetic.name}**.`)] });
            return;
        }

        await composeMcp(auth, 'athena', 'SetItemArchivedStatusBatch', { itemIds: [cosmeticId], archived: isArchived });
        await interaction.editReply({
            embeds: [
                createEmbed('success', `Successfully ${change.toLowerCase()} **${cosmetic.name}**.`)
                    .setAuthor({ name: cosmetic.name })
                    .setThumbnail(cosmetic.images.icon)
            ]
        });
    },
    options: [
        {
            name: 'name',
            description: 'The name of the cosmetic.',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'change',
            description: 'The archive status change.',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: 'Archive',
                    value: 'Archived'
                },
                {
                    name: 'Unarchive',
                    value: 'Unarchived'
                }
            ]
        }
    ]
};

export default command;
