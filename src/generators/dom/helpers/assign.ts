import { JsHelper } from '../../code/JsHelper';
import { indent } from '../../../utils/string';

/**
 * Assign to a target object.
 * 
 * @return {JsFunction}
 */
export default new JsHelper({
    id: 'assign',
    name: 'assign',
    signature: ['target'],
    content: [
        `var k, source, i = 1, len = arguments.length;`,
        null,
        `for (; i < len; i++) {`,
        indent(`source = arguments[i];`),
        indent(`for (k in source) target[k] = source[k];`),
        `}`,
        null,
        `return target;`
    ],
});