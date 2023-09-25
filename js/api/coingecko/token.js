import {getTokenId, isSupported, refreshSupportedTokens} from './supported_tokens.js';
import {getCachedData, MILLISECONDS_ONE_DAY, requiresRefresh, setCachedData, setLastRefreshDate} from '../../cache.js';
import {validateChain} from '../../validation.js';

/** Base URL for CoinGecko token data. */
const URL_BASE = 'https://tokens.coingecko.com/';

/** File name for CoinGecko token data. */
const URL_FILE_NAME = 'all.json';

/** Supported chains and their corresponding CoinGecko API endpoints. */
export const ENDPOINTS = new Map([
    ['Arbitrum', 'arbitrum-one'],
    ['Ethereum', 'ethereum'],
    ['Optimism', 'optimistic-ethereum'],
    ['Polygon', 'polygon-pos']
]);

/**
 * Fetches the token data for all supported chains and saves it in the local storage.
 *
 * @param progressCallback Callback function to measure progress. Called once for each chain and once when the set of supported tokens is refreshed.
 * @returns {Promise<void>} Promise that resolves when all chains have been processed.
 */
export async function refreshTokenCache(progressCallback) {
    await refreshSupportedTokens(progressCallback);

    for (const [chain, endpoint] of ENDPOINTS.entries()) {
        if (!requiresRefresh(getCacheKey(chain), MILLISECONDS_ONE_DAY)) {
            progressCallback();
            continue;
        }

        const url = URL_BASE + endpoint + '/' + URL_FILE_NAME;
        let response = null;
        try {
            response = await fetch(url);
        } catch (error) {
            console.error(`Error fetching token data for ${chain} from ${url}: ${error}`)
            progressCallback();
            continue;
        }

        let data = null;
        try {
            data = await response.json()
        } catch (error) {
            console.error(`Error parsing token data for ${chain}: ${error}`)
            progressCallback();
            continue;
        }

        // Add Token IDs and chain names to the token data, and remove tokens that are not supported by the token price API.
        data.tokens = data.tokens.filter(token => {
            // All tokens require a chain and logoURI to pass validation. This is why we set them here.
            token.chain = chain;
            token.logoURI = token.logoURI || '';

            return isSupported(token)
        });
        data.tokens = data.tokens.map(token => {
            token.id = getTokenId(token);
            return token;
        });

        setCachedData(getCacheKey(chain), data);
        setLastRefreshDate(getCacheKey(chain));
        progressCallback();
    }
}

/**
 * Returns the key used to store the token data for a given chain.
 *
 * @param chain Chain name.
 * @returns {string} Key used to store the token data for a given chain.
 */
function getCacheKey(chain) {
 return 'tokens-' + chain;
}

/**
 * Retrieves the token data for a given chain.
 *
 * @param chain Chain name.
 * @returns {any|null} Token data for a given chain.
 * @throws {Error} Thrown if the chain is invalid or if there is an error parsing the cached data.
 */
export function getTokenData(chain) {
    validateChain(chain)
    return getCachedData(getCacheKey(chain));
}

/**
 * Retrieves the total number of supported chains.
 *
 * @returns {number} Total number of supported chains.
 */
export function getTotalChains() {
    return ENDPOINTS.size;
}