import { JsHelper } from '../../code/JsHelper';
import { indent } from '../../../utils/string';

/**
 * Initialize a component.
 * 
 * @return {JsFunction}
 */
export default new JsHelper({
    id: 'proxy',
    name: 'proxy',
    signature: ['target', 'source'],
    content: [
        `Object.keys(source).forEach(function (key) {`,
        indent(`Object.defineProperty(target, key, {`),
        indent(indent(`enumerable: true,`)),
        indent(indent(`configurable: true,`)),
        indent(indent(`get: function() {`)),
        indent(indent(indent(`return source[key];`))),
        indent(indent(`},`)),
        indent(indent(`set: function(val) {`)),
        indent(indent(indent(`source[key] = val;`))),
        indent(indent(`},`)),
        indent(`});`),
        `});`,
    ],
});