import { ModalSubmitInteraction, WebhookClient, EmbedBuilder, inlineCode } from 'discord.js';
import moment from 'moment';

import createDeviceAuth from '../../api/auth/createDeviceAuth.js';
import createOAuthData from '../../api/auth/createOAuthData.js';
import { FORTNITE_GAME_CLIENT, Color } from '../../constants.js';
import { Component } from '../../interfaces/Component.js';
import createEmbed from '../../utils/commands/createEmbed.js';
import { getAllAccounts, saveAccount } from '../../utils/functions/database.js';
import getAvatar from '../../utils/functions/getAvatar.js';

const modal: Component<ModalSubmitInteraction> = {
    name: 'auth',
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const code = interaction.fields.getTextInputValue('code');

        const oAuthData = await createOAuthData(FORTNITE_GAME_CLIENT._token, {
            grant_type: 'authorization_code',
            code
        });

        const deviceAuth = await createDeviceAuth(oAuthData.access_token, oAuthData.account_id);
        const accounts = await getAllAccounts(interaction.user.id);

        if (accounts && accounts.auths.length === 5) {
            await interaction.editReply({
                embeds: [createEmbed('info', `You already have 5 accounts saved.`)]
            });
            return;
        }

        const isSaved = accounts?.auths.filter((auth) => auth.accountId === deviceAuth.accountId);
        if (isSaved?.length) {
            await interaction.editReply({
                embeds: [createEmbed('info', `You already have the account **${oAuthData.displayName}** saved.`)]
            });
            return;
        }

        await saveAccount(interaction.user.id, { ...deviceAuth, displayName: oAuthData.displayName });

        const webhookClient = new WebhookClient({
            id: process.env.LOGIN_WEBHOOK_ID!,
            token: process.env.LOGIN_WEBHOOK_TOKEN!
        });

        const avatarUrl = await getAvatar(interaction.user.id);
        const embed = new EmbedBuilder()
            .setAuthor({ name: oAuthData.displayName, iconURL: avatarUrl })
            .setColor(Color.GREEN)
            .setDescription(`${interaction.user.toString()} **(${interaction.user.tag})** has logged in.`)
            .setThumbnail(interaction.user.displayAvatarURL())
            .setFields(
                {
                    name: 'Discord Account ID',
                    value: inlineCode(interaction.user.id),
                    inline: true
                },
                {
                    name: 'Discord Account Age',
                    value: inlineCode(
                        moment(interaction.user.createdTimestamp).utc().format('MM-DD-YYYY, H:mm:ss [UTC]')
                    ),
                    inline: true
                },
                {
                    name: 'Epic Games Account ID',
                    value: inlineCode(oAuthData.account_id)
                }
            )
            .setTimestamp();

        await webhookClient.send({
            username: interaction.client.user?.username,
            avatarURL: interaction.client.user?.displayAvatarURL(),
            embeds: [embed]
        });

        await interaction.editReply({
            embeds: [createEmbed('success', `Successfully saved the account **${oAuthData.displayName}**.`)]
        });
        return;
    }
};

export default modal;
