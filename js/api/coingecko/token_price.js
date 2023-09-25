import {validateNonEmptyString, validateStringArray} from '../../validation.js';
import {getCachedData, MILLISECONDS_ONE_HOUR, setCachedData, setLastRefreshDate} from '../../cache.js';

/** URL for CoinGecko token price data. */
const URL_TOKEN_PRICE = 'https://api.coingecko.com/api/v3/simple/price';

/** URL for CoinGecko supported currencies. */
const URL_SUPPORTED_CURRENCIES = 'https://api.coingecko.com/api/v3/simple/supported_vs_currencies';


/**
 * Fetches the token price data for all supported tokens and saves it in the local storage.
 *
 * @param progressCallback Callback function to measure progress. Called once.
 * @param tokenIds IDs of the tokens whose price data should be refreshed.
 * @returns {Promise<void>} Promise that resolves when all data has been processed.
 *
 * @throws {Error} Thrown if `tokenIds` is not an array of strings.
 */
export async function refreshTokenPriceCache(progressCallback, tokenIds) {
    try {
        validateStringArray(tokenIds);
    } catch (error) {
        progressCallback();
        throw error;
    }

    tokenIds = tokenIds.filter(tokenId => !requiresRefresh(tokenId))

    if (tokenIds.length === 0) {
        progressCallback();
        return;
    }

    if (tokenIds.length > 50) {
        // todo Determine whether the request fails due to an excessively long URL or if it's based on # of tokens.
        console.error('Cannot fetch price data for more than 50 tokens at once.');
        progressCallback();
        return;
    }

    let supportedCurrencies = null;
    try {
        supportedCurrencies = await getSupportedCurrencies();
    } catch (error) {
        console.error(`Error fetching supported currencies: ${error}`);
        progressCallback();
        return;
    }

    let response = null;
    try {
        response = await fetch(
            URL_TOKEN_PRICE + '?' + new URLSearchParams({
                ids: tokenIds.join(','),
                vs_currencies: supportedCurrencies.join(','),
                precision: 'full'
            })
        );
    } catch(error) {
        console.error(`Error fetching token price data from ${URL_TOKEN_PRICE}: ${error}`);
        progressCallback();
        return;
    }

    let data = null;
    try {
        data = await response.json();
    } catch(error) {
        console.error(`Error parsing token price data: ${error}`);
        progressCallback();
        return;
    }

    setCachedData(getCacheKey(), data);
    setLastRefreshDate(getCacheKey());
    progressCallback();
}

/**
 * Determines whether the cached price of a token requires a refresh.
 *
 * @param tokenId Token ID.
 * @returns {boolean} Whether the token price requires a refresh.
 */
function requiresRefresh(tokenId) {
    let lastEpoch = localStorage.getItem(getCacheKey())[tokenId]?.last_refreshed;
    if (!lastEpoch) {
        return true;
    }

    lastEpoch = parseInt(lastEpoch);
    if (isNaN(lastEpoch)) {
        return true;
    }

    return (new Date().getTime() - lastEpoch) >= MILLISECONDS_ONE_HOUR;
}

/**
 * Retrieves the key used to store the token price data.
 *
 * @returns {string} Key used to store the token price data.
 */
function getCacheKey() {
    return 'tokens-prices';
}

/**
 * Retrieves an array of supported currencies from CoinGecko.
 *
 * @returns {Promise<any>} Promise that resolves to an array of supported currencies.
 * @throws Error If the request fails or the response cannot be parsed.
 */
async function getSupportedCurrencies() {
    let response = null;
    try {
        response = await fetch(URL_SUPPORTED_CURRENCIES);
    } catch (error) {
        throw Error(`Error fetching supported currencies from ${URL_SUPPORTED_CURRENCIES}: ${error}`);
    }

    try {
        return await response.json();
    } catch (error) {
        throw Error(`Error parsing supported currencies: ${error}`);
    }
}

/**
 * Retrieves the price data of a token.
 *
 * @param tokenId Token ID.
 * @returns {*|null} Price data of the token.
 * @throws {Error} Thrown if the token ID is not a non-empty string or if there is an error parsing the cached data.
 */
export function getTokenPrice(tokenId) {
    validateNonEmptyString(tokenId);
    return getCachedData(getCacheKey())[tokenId];
}