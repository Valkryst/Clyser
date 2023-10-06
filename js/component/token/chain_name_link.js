import {validateChain} from '../../validation.js';

/**
 * Renders a link to the homepage with a chain name as a query parameter.
 *
 * @param {string} chain Chain name to render a link for.
 * @returns {string} HTML representation of the link.
 * @throws {Error} Thrown if `chain` is not a valid chain.
 */
export const ChainNameLink = {
    render: (chain) => {
        validateChain(chain);

        return `
            <a href='index.html?chains=${chain}' target='_blank'>
                ${chain}
            </a>
        `;
    }
}