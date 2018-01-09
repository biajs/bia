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
    signature: ['obj', 'key', 'val', 'namespace', 'onUpdate'],
    content: [
        `if (val && typeof val === 'object') observe(val, namespace, onUpdate);`,
        null,

        // @todo: make a code object to make this kind of this easier
        `Object.defineProperty(obj, key, {`,
        indent(`enumerable: true,`),
        indent(`configurable: true,`),
        indent(`get: function () {`),
        indent(indent(`return val;`)),
        indent(`},`),
        indent(`set: function (newVal) {`),
        indent(indent(`val = newVal;`)),
        indent(indent(`setChangedState(namespace);`)),
        indent(indent(`Promise.resolve().then(executePendingUpdates.bind(null, onUpdate));`)),
        indent(`},`),
        `});`,
    ],
});