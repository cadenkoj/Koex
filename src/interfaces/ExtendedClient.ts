import { Client, Collection } from 'discord.js';
import { LRUCache } from 'lru-cache';

import { Command } from './Command.js';
import { Component, ComponentInteraction } from './Component.js';

export interface ExtendedClient extends Client {
    cache: LRUCache<string, Buffer>;
    commands: Collection<string, Command>;
    components: Collection<string, Component<ComponentInteraction>>;
}
