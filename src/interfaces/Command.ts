import { ChatInputApplicationCommandData, ChatInputCommandInteraction } from 'discord.js';

export interface Command extends ChatInputApplicationCommandData {
    execute: (interaction: ChatInputCommandInteraction) => Promise<any>;
}
