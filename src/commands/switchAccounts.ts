import { ActionRowBuilder, ApplicationCommandType, EmbedBuilder, StringSelectMenuBuilder } from 'discord.js';

import { Color } from '../constants.js';
import { Command } from '../interfaces/Command.js';
import createEmbed from '../utils/commands/createEmbed.js';
import { getAccount } from '../utils/functions/database.js';

const command: Command = {
    name: 'switch-accounts',
    description: 'Switch your active Epic Games account.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const accounts = await getAccount(interaction.user.id);

        if (!accounts || !accounts.auths.length) {
            await interaction.editReply({ embeds: [createEmbed('info', 'You are not logged into any accounts.')] });
            return;
        }
        const options = accounts.auths.map((a) => ({
            label: a.displayName,
            description: a.accountId,
            value: a.accountId
        }));

        const embed = new EmbedBuilder().setColor(Color.BLUE).addFields([
            {
                name: 'Switching Accounts',
                value: `Use the select menu below to switch accounts.`
            }
        ]);

        const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
                .setPlaceholder('Account')
                .setCustomId('switchAccounts')
                .setMaxValues(1)
                .setMinValues(1)
                .setOptions(options)
        );

        await interaction.editReply({ embeds: [embed], components: [row] });
    }
};

export default command;
