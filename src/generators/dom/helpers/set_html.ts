import { JsHelper } from '../../code/JsHelper';

/**
 * Set an element's inner HTML.
 * 
 * @return {JsFunction}
 */
export default new JsHelper({
    id: 'setHtml',
    name: 'setHtml',
    signature: ['el', 'html'],
    content: [
        `el.innerHTML = html;`,
    ],
});