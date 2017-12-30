import { JsHelper } from '../../code/JsHelper';

/**
 * Set style.
 * 
 * @return {JsFunction}
 */
export default new JsHelper({
    id: 'setStyle',
    name: 'setStyle',
    signature: ['el', 'key', 'value'],
    content: [
        `el.style.setProperty(key, value);`,
    ],
});