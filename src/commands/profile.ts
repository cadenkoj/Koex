import { ApplicationCommandType, AttachmentBuilder, EmbedBuilder } from 'discord.js';

import composeMcp from '../api/mcp/composeMcp.js';
import { Color } from '../constants.js';
import { Command } from '../interfaces/Command.js';
import createAuthData from '../utils/functions/createAuthData.js';
import createEmbed from '../utils/commands/createEmbed.js';
import getBanner from '../utils/functions/getBanner.js';
import getAvatar from '../utils/functions/getAvatar.js';
import { CampaignProfileData } from '../utils/helpers/operationResources.js';
import { Emoji } from './../constants.js';

type Outpost = 'Stonewood' | 'Plankerton' | 'Canny Valley' | 'Twine Peaks';
const outposts: Partial<Record<string, Outpost>> = {
    'Outpost:outpostcore_pve_01': 'Stonewood',
    'Outpost:outpostcore_pve_02': 'Plankerton',
    'Outpost:outpostcore_pve_03': 'Canny Valley',
    'Outpost:outpostcore_pve_04': 'Twine Peaks'
};

const achievements: Partial<Record<string, keyof typeof Emoji>> = {
    'Quest:achievement_playwithothers': 'PLAYS_WELL_WITH_OTHERS',
    'Quest:achievement_savesurvivors': 'GUARDIAN_ANGEL',
    'Quest:achievement_loottreasurechests': 'LOOT_LEGEND',
    'Quest:achievement_destroygnomes': 'GO_GNOME',
    'Quest:achievement_killmistmonsters': 'UNSPEAKABLE_HORRORS',
    'Quest:achievement_buildstructures': 'TALENTED_BUILDER'
};

const command: Command = {
    name: 'profile',
    description: 'Get information about your Save the World profile.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply();

        const auth = await createAuthData(interaction.user.id);

        if (!auth) {
            await interaction.editReply({ embeds: [createEmbed('info', 'You are not logged in.')] });
            return;
        }

        const campaignProfile = await composeMcp<CampaignProfileData>(auth, 'campaign', 'QueryPublicProfile');

        const data = campaignProfile.profileChanges[0].profile;
        const { level, rewards_claimed_post_max_level, research_levels } = data.stats.attributes;

        const emojis = Object.values(data.items)
            .filter((v) => Object.keys(achievements).includes(v.templateId) && v.attributes.quest_state === 'Claimed')
            .map((v) => Emoji[achievements[v.templateId] as keyof typeof Emoji]);

        // const bannerUrl = await getBanner(interaction.user.id);
        const avatarUrl = await getAvatar(interaction.user.id);

        const profileMetadata = await composeMcp(auth, 'metadata', 'QueryProfile');
        const metadata = profileMetadata.profileChanges[0].profile;

        const outpostLevels = Object.values(metadata.items)
            .filter((v) => Object.keys(outposts).includes(v.templateId))
            .sort((a, b) => a.templateId.localeCompare(b.templateId))
            .map((v) => `**${outposts[v.templateId]}**: \`${v.attributes.level}\``);

        const researchLevels = Object.entries(research_levels).map(
            ([k, v]) => `${Emoji[k.toUpperCase() as keyof typeof Emoji]} \`${v}\``
        );

        // const attachment = new AttachmentBuilder(bannerUrl, { name: 'buffer.png' });

        const embed = new EmbedBuilder()
            .setColor(Color.GRAY)
            .setAuthor({ name: auth.displayName, iconURL: avatarUrl })
            .setDescription(emojis.length ? emojis.join(' ') : null)
            .addFields([
                {
                    name: 'Level',
                    value: `Commander: \`${level + (rewards_claimed_post_max_level ? ' (MAX)' : '')}\``,
                    inline: true
                },
                {
                    name: 'SSDs',
                    value: outpostLevels.join('\n')
                },
                {
                    name: 'Research',
                    value: researchLevels.join(' '),
                    inline: true
                }
            ])
            .setThumbnail('attachment://buffer.png')
            .setFooter({ text: `Account ID: ${auth.accountId}` })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    }
};

export default command;
