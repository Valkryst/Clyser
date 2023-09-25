import {validateString, validateStringArray} from '../validation.js';

/**
 * Renders a progress bar with a label.
 *
 * @param {string} id ID of the progress bar.
 * @param {string} label Label for the progress bar.
 * @returns {string} HTML of the progress bar.
 *
 * @throws {Error} Thrown if `id` or `label` are not strings.
 */
export const ProgressBar = {
    render: (id, label) => {
        validateString(id);
        validateString(label);

        return `
            <progress id='${id}' aria-label="${label}" max='100' value='0'></progress>
        `;
    }
}