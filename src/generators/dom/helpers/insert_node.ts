import { JsHelper } from '../../code/JsHelper';

/**
 * Insert a node before another node.
 * 
 * @return {JsFunction}
 */
export default new JsHelper({
    id: 'insertNode',
    name: 'insertNode',
    signature: ['node', 'target', 'anchor'],
    content: [
        `target.insertBefore(node, anchor);`,
    ],
});