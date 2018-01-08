import { JsHelper } from '../../code/JsHelper';
import { indent } from '../../../utils/string';

/**
 * Show or hide an element.
 * 
 * @return {JsFunction}
 */
export default new JsHelper({
    id: 'observe',
    name: 'observe',
    signature: ['obj', 'namespace', 'onUpdate'],
    content: [
        `var keys = Object.keys(obj);`,
        null,
        `for (var i = 0, len = keys.length; i < len; i++) {`,
        indent(`var key = keys[i];`),
        indent(`defineReactive(obj, key, obj[key], namespace.concat(key), onUpdate);`),
        `}`
    ],
});