import { ExtendedClient } from '../interfaces/ExtendedClient.js';

export const deleteCatalogCache = async (client: ExtendedClient) => {
    client.cache.delete('catalog');
};
