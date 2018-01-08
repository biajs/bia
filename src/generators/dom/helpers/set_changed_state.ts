import { JsHelper } from '../../code/JsHelper';
import { indent } from '../../../utils/string';

/**
 * Set changes pieces of state.
 * 
 * @return {JsFunction}
 */
export default new JsHelper({
    id: 'setChangedState',
    name: 'setChangedState',
    signature: ['namespace'],
    content: [
        `var key, i = 0, len = namespace.length, obj = changedState;`,
        `isUpdating = true;`,
        `for (; i < len; i++) {`,
        indent(`key = namespace[i];`),
        indent(`if (typeof obj[key] === 'undefined') obj[key] = {};`),
        indent(`obj = obj[key];`),
        `}`,
    ],
});