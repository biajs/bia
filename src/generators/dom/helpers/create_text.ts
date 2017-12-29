import { JsHelper } from '../../code/JsHelper';

/**
 * Create element.
 * 
 * @return {JsFunction}
 */
export default new JsHelper({
    id: 'createText',
    name: 'createText',
    signature: ['text'],
    content: [
        `return document.createTextNode(text);`,
    ],
});