import { basename, join } from 'node:path';

import { glob } from 'glob';

import { IS_PROD } from '../../constants.js';
import { Event } from '../../interfaces/Event.js';
import { ExtendedClient } from '../../interfaces/ExtendedClient.js';

const loadEvents = async (client: ExtendedClient) => {
    const files = glob.sync(`${IS_PROD ? 'dist' : 'src'}/events/**/*.{js,ts}`);

    for (const file of files) {
        const path = join(process.cwd(), file);
        const url = new URL('file:///' + path);
        const event: Event = (await import(url.href)).default;

        const name = event.name ?? basename(file).split('.')[0];

        client.on(name, event.execute.bind(null, client));
    }
};

export default loadEvents;
