import { JsHelper } from '../../code/JsHelper';

/**
 * Show or hide an element.
 * 
 * @return {JsFunction}
 */
export default new JsHelper({
    id: 'walk',
    name: 'walk',
    signature: ['obj'],
    content: [
        `var i = 0, keys = Object.keys(obj), len = keys.length;`,
        `for (;i < len; i++) defineReactive(obj, keys[i], obj[keys[i]]);`,
    ],
});