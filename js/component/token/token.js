import {validateToken} from '../../validation.js';
import {TokenAddressLink} from './token_address_link.js';
import {ChainNameLink} from './chain_name_link.js';

export const Token = {
    render: (token) => {
        validateToken(token);

        return `
            <img src='${token.logoURI}' alt='Logo of ${token.name}.' />
            <h1>${token.name}</h1>
            <p>Address: ${TokenAddressLink.render(token)}</p>
            <p>Chain: ${ChainNameLink.render(token.chain)}</p>
            <p>Symbol: ${token.symbol}</p>
        `
    }
}