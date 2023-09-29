import {ProgressBar} from '../component/progress_bar.js';
import {getTotalChains, refreshTokenCache} from '../api/coingecko/token.js';
import {refreshTokenPriceCache} from '../api/coingecko/token_price.js';

/**
 * Replaces content of the `<main>` element with a progress bar while loading all token data required by the site. When
 * loading is complete, the original content of the `<main>` element is restored.
 *
 * @returns {Promise<void>} A promise that resolves when all token data has been loaded.
 */
export async function initializeTokenData() {
    const mainElement = document.getElementsByTagName('main')[0];
    if (!mainElement) {
        throw new Error('No <main> element found');
    }

    const oldContent = mainElement.innerHTML;

    mainElement.innerHTML = ProgressBar.render('progress-bar', 'Loading tokens...');

    async function load() {
        const progressBar = document.getElementById('progress-bar');
        const progressIncrement = progressBar.max / (getTotalChains() + 2);

        progressBar.setAttribute('aria-label', 'Loading tokens...');
        await refreshTokenCache(() => {
            progressBar.value += progressIncrement;
        });

        await refreshTokenPriceCache(() => {
            progressBar.value += progressIncrement;
        }, []);
    }

    await load();

    mainElement.innerHTML = oldContent;
}