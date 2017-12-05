import { JsHelper } from '../../code/JsHelper';

/**
 * Create a text node.
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