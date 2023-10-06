import {validateToken} from '../../validation.js';

/**
 * Renders a link to a token's address on blockchain.com.
 *
 * @param {object} token Token to render a link for.
 * @returns {string} HTML representation of the link.
 * @throws {Error} Thrown if `token` is not a valid token.
 */
export const TokenAddressLink = {
    render: (token) => {
        validateToken(token);

        return `
            <a href='https://www.blockchain.com/explorer/search?search=${token.address}' target='_blank'>
                ${token.address}
            </a>
        `
    }
}