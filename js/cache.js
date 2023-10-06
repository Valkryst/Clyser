import {validateDefined, validateNonEmptyString, validateNonZeroNumber, validateStringArray} from './validation.js';


/** @type {number} Number of milliseconds in one hour. */
export const MILLISECONDS_ONE_HOUR = 3_600_000;

/** @type {number} Number of milliseconds in one day. */
export const MILLISECONDS_ONE_DAY = 86_400_000;

/**
 * For each key, deletes the associated cache data.
 *
 * @param {string[]} keys Keys whose associated cache data should be deleted.
 */
export function clear(...keys) {
    validateStringArray(keys);

    for (const key of keys) {
        validateNonEmptyString(key);
        localStorage.removeItem(key);
    }
}

/**
 * Determines whether the cache for a given key needs to be refreshed.
 *
 * @param {string} key Key used to retrieve the cached data.
 * @param {number} refreshInterval Number of milliseconds to elapse before the cache needs to be refreshed.
 * @returns {boolean} Whether the cache needs to be refreshed.
 * @throws {Error} Thrown if the key is not a non-empty string, if the refresh interval is not a non-zero number, or if there is an error parsing the cached data.
 */
export function requiresRefresh(key, refreshInterval) {
    validateNonEmptyString(key);
    validateNonZeroNumber(refreshInterval);

    let data = localStorage.getItem(key);
    if (!data) {
        return true;
    }

    try {
        data = JSON.parse(data);
    } catch (error) {
        console.error(`Error parsing cache data for ${key}: ${error}`);
        return true;
    }

    let lastEpoch = data?.last_refreshed;
    if (!lastEpoch) {
        return true;
    }

    lastEpoch = parseInt(lastEpoch);
    if (isNaN(lastEpoch)) {
        return true;
    }

    return (new Date().getTime() - lastEpoch) >= refreshInterval;
}

/**
 * Retrieves the cached data for a given key.
 *
 * @param {string} key Key used to retrieve the cached data.
 * @returns {any|null} Cached data for a given key, or null if the data does not exist.
 * @throws {Error} Thrown if the key is not a non-empty string or if there is an error parsing the cached data.
 */
export function getCachedData(key) {
    validateNonEmptyString(key);

    const data = localStorage.getItem(key);
    if (!data) {
        return null;
    }

    try {
        return JSON.parse(data);
    } catch (error) {
        throw Error(`Error parsing cache data for ${key}: ${error}`);
    }
}

/**
 * Sets the cached data for a given key.
 *
 * @param {string} key Key used to store the data.
 * @param {object} object Object to store.
 * @throws {Error} Thrown if the key is not a non-empty string or if the object is not defined.
 */
export function setCachedData(key, object) {
    validateNonEmptyString(key);
    validateDefined(object);
    localStorage.setItem(key, JSON.stringify(object));
}

/**
 * Sets the last refresh date on the data associated with a given key.
 *
 * @param {string} key Key used to retrieve and store the cached data.
 */
export function setLastRefreshDate(key) {
    const data = getCachedData(key);
    if (!data) {
        console.error(`Cache data for ${key} not found.`);
        return;
    }

    data.last_refreshed = new Date().getTime();
    setCachedData(key, data)
}