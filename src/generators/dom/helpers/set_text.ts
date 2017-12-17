import { JsHelper } from '../../code/JsHelper';

/**
 * Set an element's text content.
 * 
 * @return {JsFunction}
 */
export default new JsHelper({
    id: 'setText',
    name: 'setText',
    signature: ['el', 'text'],
    content: [
        `el.textContent = text;`,
    ],
});