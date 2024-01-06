import {
    ApplicationCommandType,
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder
} from 'discord.js';

import { Color } from '../constants.js';
import { Command } from '../interfaces/Command.js';
import createEmbed from '../utils/commands/createEmbed.js';
import createAuthData from '../utils/functions/createAuthData.js';
import getAvatar from '../utils/functions/getAvatar.js';

const command: Command = {
    name: 'manage-friends',
    description: 'Manage your friends list on Epic Games.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const auth = await createAuthData(interaction.user.id);
        const avatarUrl = await getAvatar(interaction.user.id);

        if (!auth) {
            await interaction.editReply({ embeds: [createEmbed('info', 'You are not logged in.')] });
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle('Manage Friends')
            .setColor(Color.BLUE)
            .setDescription(`Click an option below to manage your friends list.`)
            .setFooter({ text: auth.displayName, iconURL: avatarUrl });

        const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('selectFriendAction')
                .setMaxValues(1)
                .setMinValues(1)
                .setOptions(
                    new StringSelectMenuOptionBuilder().setLabel('Accept All').setValue('acceptAll'),
                    new StringSelectMenuOptionBuilder().setLabel('Cancel All').setValue('cancelAll'),
                    new StringSelectMenuOptionBuilder().setLabel('Reject All').setValue('rejectAll'),
                    new StringSelectMenuOptionBuilder().setLabel('Remove All').setValue('removeAll'),
                    new StringSelectMenuOptionBuilder().setLabel('Unblock All').setValue('unblockAll')
                )
        );

        await interaction.editReply({ embeds: [embed], components: [row] });
    }
};

export default command;
