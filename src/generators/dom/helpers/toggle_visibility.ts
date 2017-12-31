import { JsHelper } from '../../code/JsHelper';

/**
 * Show or hide an element.
 * 
 * @return {JsFunction}
 */
export default new JsHelper({
    id: 'toggleVisibility',
    name: 'toggleVisibility',
    signature: ['el', 'isVisible'],
    content: [
        `if (isVisible) el.style.removeProperty('display');`,
        `else el.style.setProperty('display', 'none');`,
    ],
});