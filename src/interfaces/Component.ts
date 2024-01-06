import { ButtonInteraction, ModalSubmitInteraction, AnySelectMenuInteraction } from 'discord.js';

export type ComponentInteraction = ButtonInteraction | ModalSubmitInteraction | AnySelectMenuInteraction;

export interface Component<T extends ComponentInteraction> {
    name: T['customId'];
    execute: (interaction: T) => Promise<any>;
}
