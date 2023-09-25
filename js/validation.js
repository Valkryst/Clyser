import {ENDPOINTS} from './api/coingecko/token.js';

/**
 * Determines whether a given object is an Array.
 *
 * @param object Object to check.
 * @throws {Error} Thrown if the object is not an Array.
 */
export function validateArray(object) {
    validateDefined(object);

    if (!Array.isArray(object)) {
        throw new Error('Parameter "object" must be an Array. ' + object);
    }
}

/**
 * Determines whether a given object is a chain.
 *
 * @param object Object to check.
 * @throws {Error} Thrown if the object is not a chain.
 */
export function validateChain(object) {
    validateString(object);

    if (!ENDPOINTS.has(object)) {
        throw new Error('Parameter "object" must be a valid chain. ' + object);
    }
}

/**
 * Determines whether a given object is an array containing only chains.
 *
 * @param object Object to check.
 * @throws {Error} Thrown if the object is not an array of chains.
 */
export function validateChainArray(object) {
    validateArray(object);

    for (const element of object) {
        validateChain(element);
    }
}

/**
 * Determines whether a given object is null or undefined.
 *
 * @param object Object to check.
 * @throws {Error} Thrown if the object is null or undefined.
 */
export function validateDefined(object) {
    if (object == null) {
        throw new Error('Parameter "object" cannot be null or undefined. ' + object)
    }
}

/**
 * Determines whether a given object is a non-empty string.
 *
 * This removes all whitespace from the string before checking its length.
 *
 * @param object Object to check.
 * @throws {Error} Thrown if the object is not a non-empty string.
 */
export function validateNonEmptyString(object) {
    validateString(object);

    if (object.replace(/\s/g, '').length === 0) {
        throw new Error('Parameter "object" must be a non-empty string. ' + object);
    }
}

/**
 * Determines whether a given object is a non-zero number.
 *
 * @param object Object to check.
 * @throws {Error} Thrown if the object is not a non-zero number.
 */
export function validateNonZeroNumber(object) {
    validateNumber(object);

    if (object <= 0) {
        throw new Error('Parameter "object" must be a non-zero number. ' + object);
    }
}

/**
 * Determines whether a given object is a number.
 *
 * @param object Object to check.
 * @throws {Error} Thrown if the object is not a number.
 */
export function validateNumber(object) {
    validateDefined(object);

    if (typeof object !== 'number') {
        throw new Error('Parameter "object" must be a number. ' + object);
    }
}

/**
 * Determines whether a given object is a string.
 *
 * @param object Object to check.
 * @throws {Error} Thrown if the object is not a string.
 */
export function validateString(object) {
    validateDefined(object);

    if (typeof object !== 'string') {
        throw new Error('Parameter "object" must be a string. ' + object);
    }
}

/**
 * Determines whether a given object is a token.
 *
 * @param object Object to check.
 * @throws {Error} Thrown if the object is not a token.
 */
export function validateToken(object) {
    validateDefined(object);

    const fields = [
        {name: 'address', type: 'string'},
        {name: 'chain', type: 'string'},
        {name: 'logoURI', type: 'string'},
        {name: 'name', type: 'string'},
        {name: 'symbol', type: 'string'}
    ];

    for (const field of fields) {
        validateDefined(object[field.name]);

        switch (field.type) {
            case 'number': {
                validateNumber(object[field.name]);
                break;
            }
            case 'string': {
                validateString(object[field.name]);
                break;
            }
            default: {
                throw new Error(`Unsupported type: ${field.type}`);
            }
        }
    }
}

/**
 * Determines whether a given object is an array containing only strings.
 *
 * @param array Array to check.
 * @throws {Error} Thrown if the array is not an array of strings.
 */
export function validateStringArray(array) {
    validateArray(array);

    for (const element of array) {
        validateString(element)
    }
}

/**
 * Determines whether a given object is an array containing only tokens.
 *
 * @param array Array to check.
 * @throws {Error} Thrown if the array is not an array of tokens.
 */
export function validateTokenArray(array) {
    validateArray(array);

    for (const element of array) {
        validateToken(element);
    }
}