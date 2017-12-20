import { JsHelper } from '../../code/JsHelper';

/**
 * No operation.
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