import {validateString, validateTokenArray} from '../../validation.js';
import {TokenListElement} from './token_list_element.js';

/**
 * Renders a table containing the given tokens.
 *
 * @param {string} id CSS ID of the table.
 * @param {any[]} tokens Array of tokens to display.
 * @returns {string} HTML of the table.
 *
 * @throws {Error} Thrown if `id` is not a string or if `tokens` is not an array of tokens.
 */
export const TokenList = {
    render: (id, tokens) => {
        validateString(id);
        validateTokenArray(tokens);

        let tableRows = [];
        tokens = tokens.sort((a, b) => a.name.localeCompare(b.name));
        for (const token of tokens) {
            tableRows.push(TokenListElement.render(token));
        }

        return `
            <table id='${id}' class='token-list'>
                <thead>
                    <tr>
                        <th>Logo</th>
                        <th>Name</th>
                        <th>Symbol</th>
                        <th>Address</th>
                        <th>Chain</th>
                    </tr>
                </thead>
                <tbody>
                    ${
                        tableRows?.length > 0
                            ? tableRows.join('')
                            : (`
                                <tr>
                                    <td>No data available.</td>
                                </tr>
                            `)
                    }
                </tbody>
            </table>
        `
    }
}