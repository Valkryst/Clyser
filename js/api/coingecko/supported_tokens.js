import {validateToken} from '../../validation.js';
import {getCachedData, MILLISECONDS_ONE_DAY, requiresRefresh, setCachedData, setLastRefreshDate} from '../../cache.js';


/** URL for CoinGecko supported tokens. */
const URL_SUPPORTED_TOKENS = 'https://api.coingecko.com/api/v3/coins/list?include_platform=false'


/**
 * Fetches the set of supported tokens and saves it in the local storage.
 *
 * @param progressCallback Callback function to measure progress. Called once.
 * @returns {Promise<void>} Promise that resolves when all data has been processed.
 */
export async function refreshSupportedTokens(progressCallback) {
    if (!requiresRefresh(getCacheKey(), MILLISECONDS_ONE_DAY)) {
        progressCallback();
        return;
    }

    let response = null;
    try {
        response = await fetch(URL_SUPPORTED_TOKENS);
    } catch (error) {
        progressCallback();
        throw Error(`Error fetching supported tokens from ${URL_SUPPORTED_TOKENS}: ${error}`);
    }

    let data = {supported_tokens: []};
    try {
        data.supported_tokens = await response.json();
    } catch (error) {
        progressCallback();
        throw Error(`Error parsing supported tokens: ${error}`);
    }

    setCachedData(getCacheKey(), data);
    setLastRefreshDate(getCacheKey());
    progressCallback();
}

/**
 * Determines whether a given token is supported by the application.
 *
 * @param token Token to check.
 * @returns {boolean} Whether the token is supported.
 * @throws {Error} Thrown if the token is invalid or if there's an error parsing the cached data.
 */
export function isSupported(token) {
    validateToken(token);

    const supportedTokens = getCachedData(getCacheKey()).supported_tokens;
    return supportedTokens.some(supportedToken => supportedToken.name === token.name);
}

/**
 * Returns the key used to store the set of supported tokens.
 *
 * @returns {string} Key used to store the set of supported tokens.
 */
function getCacheKey() {
    return 'tokens-supported';
}

/**
 * Returns the ID of a given token.
 *
 * @param token Token to retrieve the ID for.
 * @returns {string} ID of the token.
 * @throws {Error} Thrown if the token is invalid or if there's an error parsing the cached data.
 */
export function getTokenId(token) {
    validateToken(token);

    const supportedTokens = getCachedData(getCacheKey()).supported_tokens;
    return supportedTokens.find(supportedToken => supportedToken.name === token.name).id;
}