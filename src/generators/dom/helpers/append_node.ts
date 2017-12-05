import { JsHelper } from '../../code/JsHelper';

/**
 * Insert a node before another node.
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