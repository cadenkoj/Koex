import { APIEmbed, EmbedBuilder, HexColorString } from 'discord.js';

import { Color, Emoji } from '../../constants.js';

type embedType = 'error' | 'info' | 'success';

const colors: Record<embedType, HexColorString> = {
    error: Color.RED,
    info: Color.BLUE,
    success: Color.GREEN
};

const emojis: Record<embedType, string> = {
    error: Emoji.CROSS,
    info: Emoji.INFO,
    success: Emoji.CHECK
};

const createEmbed = (type: embedType, description: string, data?: APIEmbed) => {
    const baseEmbed = new EmbedBuilder().setColor(colors[type]);

    if (data) Object.assign(baseEmbed, data);

    if (type === 'error') {
        return baseEmbed
            .setTitle(`${Emoji.CROSS} Hmm... That wasn't supposed to happen`)
            .setDescription(description)
            .setFields({
                name: 'Need help?',
                value: 'Talk to us in our [support server](https://discord.gg/koex).'
            });
    }

    return baseEmbed.setDescription(`${emojis[type]} ${description}`);
};

export default createEmbed;
