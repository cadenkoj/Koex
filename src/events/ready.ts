import chalk from 'chalk';
import { ActivityType } from 'discord.js';
// import cron from 'node-cron';

import { Event } from '../interfaces/Event.js';
import { ExtendedClient } from '../interfaces/ExtendedClient.js';
import loadCommands from '../utils/handlers/loadCommands.js';
import loadComponents from '../utils/handlers/loadComponents.js';
import startAutoResearchJob from '../tasks/autoResearch.js';

export const event: Event<true> = {
    execute: async (client: ExtendedClient) => {
        const { username, discriminator } = client.user!;

        console.info(`Logged in as ${chalk.bold(username) + chalk.bold(chalk.gray('#' + discriminator))}`);

        await loadCommands(client);
        await loadComponents(client);

        setInterval(() => {
            client.user!.setActivity(`${client.guilds.cache.size} Servers`, {
                type: ActivityType.Watching
            });
        }, 60 * 1000);
    }
};

export default event;
