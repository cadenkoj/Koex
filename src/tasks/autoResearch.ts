import { APIEmbedField, codeBlock, EmbedBuilder, WebhookClient } from 'discord.js';

import _ from 'lodash';
import composeMcp from '../api/mcp/composeMcp.js';
import { Color, Emoji } from '../constants.js';
import { ExtendedClient } from '../interfaces/ExtendedClient.js';
import createEmbed from '../utils/commands/createEmbed.js';
import createAuthData from '../utils/functions/createAuthData.js';
import { getAccount, getAutoResearchUsers } from '../utils/functions/database.js';
import { CampaignProfileData, MCPResponse } from '../utils/helpers/operationResources.js';

const researchKeys = [
    {
        KeyTime: 0.0,
        KeyValue: 0.0
    },
    {
        KeyTime: 1.0,
        KeyValue: 300.0
    },
    {
        KeyTime: 10.0,
        KeyValue: 300.0
    },
    {
        KeyTime: 11.0,
        KeyValue: 600.0
    },
    {
        KeyTime: 20.0,
        KeyValue: 600.0
    },
    {
        KeyTime: 21.0,
        KeyValue: 900.0
    },
    {
        KeyTime: 30.0,
        KeyValue: 900.0
    },
    {
        KeyTime: 31.0,
        KeyValue: 1200.0
    },
    {
        KeyTime: 40.0,
        KeyValue: 1200.0
    },
    {
        KeyTime: 41.0,
        KeyValue: 1500.0
    },
    {
        KeyTime: 50.0,
        KeyValue: 1500.0
    },
    {
        KeyTime: 51.0,
        KeyValue: 1800.0
    },
    {
        KeyTime: 60.0,
        KeyValue: 1800.0
    },
    {
        KeyTime: 61.0,
        KeyValue: 2400.0
    },
    {
        KeyTime: 70.0,
        KeyValue: 2400.0
    },
    {
        KeyTime: 71.0,
        KeyValue: 3000.0
    },
    {
        KeyTime: 80.0,
        KeyValue: 3000.0
    },
    {
        KeyTime: 81.0,
        KeyValue: 3600.0
    },
    {
        KeyTime: 90.0,
        KeyValue: 3600.0
    },
    {
        KeyTime: 91.0,
        KeyValue: 4200.0
    },
    {
        KeyTime: 120.0,
        KeyValue: 4200.0
    }
];

const startAutoResearchTask = async (client: ExtendedClient) => {
    const users = await getAutoResearchUsers();

    if (!users.length) return;

    const webhookClient = new WebhookClient({
        id: process.env.AUTODAILY_WEBHOOK_ID!,
        token: process.env.AUTODAILY_WEBHOOK_TOKEN!
    });

    const webhookOptions = {
        username: client.user?.username,
        avatarURL: client.user?.displayAvatarURL()
    };

    for (const user of users) {
        setTimeout(async () => {
            const accounts = await getAccount(user.user_id);

            const fields: APIEmbedField[] = [];

            if (!accounts || !accounts.auths) {
                await webhookClient.send({
                    ...webhookOptions,
                    content: `<@!${user.user_id}>`,
                    embeds: [createEmbed('info', 'You have been logged out.')]
                });
                return;
            }

            for (const auth of accounts.auths) {
                const bearerAuth = await createAuthData(user.user_id, auth.accountId);

                if (!bearerAuth) {
                    fields.push({
                        name: auth.displayName,
                        value: 'Failed to login.'
                    });
                    continue;
                }

                let campaignProfile: MCPResponse<CampaignProfileData> | undefined = undefined;

                try {
                    campaignProfile = await composeMcp<CampaignProfileData>(
                        bearerAuth,
                        'campaign',
                        'QueryPublicProfile'
                    );
                } catch (error) {
                    fields.push({
                        name: auth.displayName,
                        value: codeBlock(String(error))
                    });
                    continue;
                }

                let { profile } = campaignProfile.profileChanges[0];

                const collectorsToClaim = Object.keys(profile.items)
                    .filter((v) => profile.items[v].templateId === 'CollectedResource:Token_collectionresource_nodegatetoken01');

                await composeMcp(bearerAuth, 'campaign', 'ClaimCollectedResources', {
                    collectorsToClaim: collectorsToClaim
                });

                campaignProfile = await composeMcp<CampaignProfileData>(bearerAuth, 'campaign', 'QueryPublicProfile');
                profile = campaignProfile.profileChanges[0].profile;

                const researchTokens = Object.values(profile.items)
                    .filter((v) => v.templateId === 'Token:collectionresource_nodegatetoken01');

                if (!researchTokens.length) {
                    fields.push({
                        name: auth.displayName,
                        value: 'No research stats found.'
                    });
                    continue;
                }

                let researchPoints = researchTokens[0].quantity;
                const partialLevels = profile.stats.attributes.research_levels

                const defaultLevels = {
                    technology: 0,
                    offense: 0,
                    fortitude: 0,
                    resistance: 0,
                }

                const levels = { ...defaultLevels, ...partialLevels }
                const stats = Object.keys(levels) as (keyof typeof levels)[];

                let max = 0;
                const field = { name: bearerAuth.displayName, value: '' } satisfies APIEmbedField;

                for (const stat of stats.sort((a, b) => levels[a]! - levels[b]!)) {
                    campaignProfile = await composeMcp<CampaignProfileData>(bearerAuth, 'campaign', 'QueryPublicProfile');
                    profile = campaignProfile.profileChanges[0].profile;

                    researchPoints = Object.values(profile.items)
                        .filter((v) => v.templateId === 'Token:collectionresource_nodegatetoken01')[0]
                        .quantity;

                    const level = levels[stat]!;

                    let cost = 0;
                    for (const item of researchKeys) {
                        if (item.KeyTime <= level + 1) cost = item.KeyValue;
                    }

                    if (level < 120) {
                        if (cost <= researchPoints) {
                            await composeMcp(bearerAuth, 'campaign', 'PurchaseResearchStatUpgrade', { statId: _.capitalize(stat) }),
                            field.value += `${Emoji[stat.toUpperCase() as keyof typeof Emoji]} **${level}** → **${level + 1}** ${Emoji.CHECK} ${Emoji.RESEARCH} -${cost.toLocaleString()}\n`;
                        } else {
                            field.value += `${Emoji[stat.toUpperCase() as keyof typeof Emoji]} **${level}** ${Emoji.CROSS} ${Emoji.RESEARCH} ${researchPoints.toLocaleString()} / ${cost.toLocaleString()}\n`;
                        }
                    } else {
                        max++;
                    }
                }

                if (max === 4) field.value += 'All stats maxed-out!\n';
                fields.push(field);
            }

            if (!fields.length) return;

            const embed = new EmbedBuilder()
                .setColor(Color.GRAY)
                .setTitle('Research Summary')
                .setFields(fields)
                .setTimestamp();

            await webhookClient.send({ ...webhookOptions, embeds: [embed] });
        }, 1000);
    }
};

export default startAutoResearchTask;
