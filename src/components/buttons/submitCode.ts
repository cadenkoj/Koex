import {
    ActionRowBuilder,
    ButtonInteraction,
    ModalActionRowComponentBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from 'discord.js';

import { Component } from '../../interfaces/Component.js';

const button: Component<ButtonInteraction> = {
    name: 'submitCode',
    execute: async (interaction) => {
        const modal = new ModalBuilder()
            .setTitle(`${interaction.client.user!.username} - Login`)
            .setCustomId('auth')
            .addComponents([
                new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents([
                    new TextInputBuilder()
                        .setLabel('Authorization Code')
                        .setCustomId('code')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                        .setPlaceholder('Paste your 32 character authorization code here.')
                        .setMaxLength(32)
                        .setMinLength(32)
                ])
            ]);

        await interaction.showModal(modal);
    }
};

export default button;
