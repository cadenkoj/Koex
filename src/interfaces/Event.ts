import { ExtendedClient } from './ExtendedClient.js';

export interface Event<T extends boolean = false> {
    name?: string;
    once?: T;
    execute: (client: ExtendedClient, ...args: any[]) => Promise<any>;
}
