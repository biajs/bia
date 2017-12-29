import { JsHelper } from '../../code/JsHelper';

/**
 * Append a dom node.
 * 
 * @return {JsFunction}
 */
export default new JsHelper({
    id: 'appendNode',
    name: 'appendNode',
    signature: ['node', 'target'],
    content: [
        `target.appendChild(node);`,
    ],
});