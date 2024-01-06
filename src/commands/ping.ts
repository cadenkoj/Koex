import { ApplicationCommandType } from 'discord.js';

import { Command } from '../interfaces/Command.js';
import createEmbed from '../utils/commands/createEmbed.js';

const command: Command = {
    name: 'ping',
    description: "Retrieve's the bots latency.",
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        const reply = await interaction.deferReply({ fetchReply: true });

        const latency = reply.createdTimestamp - interaction.createdTimestamp;
        const wsLatency = interaction.client.ws.ping;

        await interaction.editReply({
            embeds: [createEmbed('info', `Pong! Latency is \`${latency}ms\`. Gateway latency is \`${wsLatency}ms\`.`)]
        });
    }
};

export default command;
