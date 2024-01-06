import { ApplicationCommandType } from 'discord.js';

import deletePartyMember from '../api/party/deletePartyMember.js';
import getParty from '../api/party/getParty.js';
import { Command } from '../interfaces/Command.js';
import createEmbed from '../utils/commands/createEmbed.js';
import createAuthData from '../utils/functions/createAuthData.js';

const command: Command = {
    name: 'dupe',
    description: 'Duplicate items from your Save the World inventory.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply();

        const auth = await createAuthData(interaction.user.id);

        if (!auth) {
            await interaction.editReply({ embeds: [createEmbed('info', 'You are not logged in.')] });
            return;
        }

        const party = await getParty(auth.accessToken, auth.accountId);

        if (!party.current.length) {
            await interaction.editReply({ embeds: [createEmbed('info', 'You are not in a party.')] });
            return;
        }

        await deletePartyMember(auth.accessToken, auth.accountId, party.current[0].id);

        await interaction.editReply({ embeds: [createEmbed('success', 'Dupe successful!')] });
    }
};

export default command;
