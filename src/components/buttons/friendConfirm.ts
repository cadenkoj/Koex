import { ActionRowBuilder, ButtonInteraction, StringSelectMenuOptionBuilder, StringSelectMenuBuilder } from 'discord.js';

import addFriendFromId from '../../api/friend/addFriendFromId.js';
import getBlocklist from '../../api/friend/getBlocklist.js';
import getIncomingRequests from '../../api/friend/getIncomingRequests.js';
import getOutgoingRequests from '../../api/friend/getOutgoingRequests.js';
import removeAllFriends from '../../api/friend/removeAllFriends.js';
import removeFriendFromId from '../../api/friend/removeFriendFromId.js';
import unblockUserFromId from '../../api/friend/unblockUserFromId.js';
import { PartialFriend } from '../../api/utils/helpers/interfaces.js';
import { Component } from '../../interfaces/Component.js';
import createEmbed from '../../utils/commands/createEmbed.js';
import createAuthData from '../../utils/functions/createAuthData.js';

const button: Component<ButtonInteraction> = {
    name: 'friendConfirm',
    execute: async (interaction) => {
        const action = interaction.customId.split(/-+/).pop();

        if (!action) {
            throw new Error('Unknown Action');
        }

        const auth = await createAuthData(interaction.user.id);

        if (!auth) {
            await interaction.editReply({ embeds: [createEmbed('info', 'You are not logged in.')] });
            return;
        }

        let list: PartialFriend[] = [];
        switch (action) {
            case 'acceptAll':
                list = await getIncomingRequests(auth.accessToken, auth.accountId);

                for (const entry of list) {
                    await addFriendFromId(auth.accessToken, auth.accountId, entry.accountId);
                }

                break;
            case 'cancelAll':
                list = await getOutgoingRequests(auth.accessToken, auth.accountId);

                for (const entry of list) {
                    await removeFriendFromId(auth.accessToken, auth.accountId, entry.accountId);
                }

                break;
            case 'rejectAll':
                list = await getIncomingRequests(auth.accessToken, auth.accountId);

                for (const entry of list) {
                    await removeFriendFromId(auth.accessToken, auth.accountId, entry.accountId);
                }

                break;
            case 'removeAll':
                await removeAllFriends(auth.accessToken, auth.accountId);
                break;
            case 'unblockAll':
                list = await getBlocklist(auth.accessToken, auth.accountId);

                for (const entry of list) {
                    await unblockUserFromId(auth.accessToken, auth.accountId, entry.accountId);
                }

                break;
        }

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
                .setPlaceholder('Anything else?')
        );

        await interaction.update({ components: [row] });
    }
};

export default button;
