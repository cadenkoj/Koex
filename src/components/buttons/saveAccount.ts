import {
    ActionRowBuilder,
    AttachmentBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    EmbedBuilder
} from 'discord.js';

import { Color, FORTNITE_GAME_CLIENT } from '../../constants.js';
import { Component } from '../../interfaces/Component.js';

const button: Component<ButtonInteraction> = {
    name: 'saveAccount',
    execute: async (interaction) => {
        await interaction.deferReply();

        const baseUrl = `https://www.epicgames.com/id/login?redirectUrl=https%3A%2F%2Fwww.epicgames.com%2Fid%2Fapi%2Fredirect%3FclientId%3D${FORTNITE_GAME_CLIENT._id}%26responseType%3Dcode%0A`;

        const file = new AttachmentBuilder(process.cwd() + '/assets/authCode.png');

        const embed = new EmbedBuilder()
            .setColor(Color.GRAY)
            .addFields([
                {
                    name: 'Logging In',
                    value: `\` - \` Click the **Epic Games** button below.\n\` - \` Copy the 32 character \`authorizationCode\`.\n\` - \` Click the **Submit Code** button and paste your code.`
                },
                {
                    name: 'Switching Accounts',
                    value: `Use [this link](${baseUrl}&prompt=login) to switch accounts on Epic Games.`
                }
            ])
            .setImage('attachment://authCode.png');

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder().setLabel('Epic Games').setStyle(ButtonStyle.Link).setURL(baseUrl),
            new ButtonBuilder().setLabel('Submit Code').setStyle(ButtonStyle.Primary).setCustomId('submitCode')
        );

        await interaction.editReply({ embeds: [embed], components: [row], files: [file] });
    }
};

export default button;
