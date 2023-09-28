import {ENDPOINTS} from '../../api/coingecko/token.js';

export const TokenSearchForm = {
    render: () => {
        const chainOptions = [];
        for (const [chain, _] of ENDPOINTS.entries()) {
            chainOptions.push(`<option value='${chain}'>${chain}</option>`);
        }

        return `
            <form id='token-search-form' action='tokens.html' method='get'>
                <input id='token-search-text' name='query' placeholder='Search for a token...' type='text'>
                <select autocomplete='off' name='chains'>
                    <option value=''>All Chains</option>
                    ${chainOptions.join('')}
                </select>
                <button id='token-search-button' type='submit'>Search</button>
            </form>
        `;
    }
}