import { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuInteraction } from 'discord.js';

import { Component } from '../../interfaces/Component.js';

const selectMenu: Component<StringSelectMenuInteraction> = {
    name: 'selectFriendAction',
    execute: async (interaction) => {
        const action = interaction.values[0];

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder().setCustomId(`friendConfirm-${action}`).setLabel('Confirm').setStyle(ButtonStyle.Danger)
        );

        await interaction.update({ components: [row] });
        return;
    }
};

export default selectMenu;
