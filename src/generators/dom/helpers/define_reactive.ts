import { JsHelper } from '../../code/JsHelper';
import { indent } from '../../../utils/string';

/**
 * Create element.
 * 
 * @return {JsFunction}
 */
export default new JsHelper({
    id: 'defineReactive',
    name: 'defineReactive',
    signature: ['obj', 'key', 'val'],
    content: [
        `if (val && typeof val === 'object') walk(val);`,
        null,
        `var dep = new Dep;`,

        // @todo: make a code object to make this kind of this easier
        `Object.defineProperty(obj, key, {`,
        indent(`enumerable: true,`),
        indent(`configurable: true,`),
        indent(`get: function () {`),
        indent(indent(`dep.depend();`)),
        indent(indent(`return val;`)),
        indent(`},`),
        indent(`set: function (newVal) {`),
        indent(indent(`val = newVal;`)),
        indent(indent(`dep.notify();`)),
        indent(`},`),
        `});`,
    ],
});