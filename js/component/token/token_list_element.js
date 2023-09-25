import {validateToken} from '../../validation.js';
import {ChainNameLink} from './chain_name_link.js';
import {TokenAddressLink} from './token_address_link.js';

export const TokenListElement = {
    render: (token) => {
        validateToken(token);

        return `
            <tr>
                <td>
                    <img src='${token.logoURI}' alt='Logo of ${token.name}.' />
                </td>
                <td>
                    <a href='token.html?chain=${token.chain}&tokenId=${token.id}'>
                        ${token.name}
                    </a>
                </td>
                <td>${token.symbol}</td>
                <td>${TokenAddressLink.render(token)}</td>
                <td>${ChainNameLink.render(token.chain)}</td>
            </tr>
        `;
    }
}