import { JsHelper } from '../../code/JsHelper';

/**
 * Remove an inline style.
 * 
 * @return {JsFunction}
 */
export default new JsHelper({
    id: 'removeStyle',
    name: 'removeStyle',
    signature: ['el', 'property'],
    content: [
        `el.style.removeProperty(property);`,
    ],
});