import { StringSelectMenuInteraction } from 'discord.js';

import { Component } from '../../interfaces/Component.js';
import createAuthData from '../../utils/functions/createAuthData.js';
import createEmbed from '../../utils/commands/createEmbed.js';
import { setAccounts } from '../../utils/functions/database.js';

const selectMenu: Component<StringSelectMenuInteraction> = {
    name: 'switchAccounts',
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const accountId = interaction.values[0];
        const auth = await createAuthData(interaction.user.id, accountId);

        if (!auth) {
            await interaction.editReply({ embeds: [createEmbed('info', 'You are not logged in.')] });
            return;
        }

        await setAccounts(interaction.user.id, undefined, accountId);
        await interaction.editReply({
            embeds: [createEmbed('success', `Successfully switched to account **${auth.displayName}**.`)]
        });
        return;
    }
};

export default selectMenu;
