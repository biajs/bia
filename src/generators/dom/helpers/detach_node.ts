import { JsHelper } from '../../code/JsHelper';

/**
 * Detach a node from it's parent.
 * 
 * @return {JsFunction}
 */
export default new JsHelper({
    id: 'detachNode',
    name: 'detachNode',
    signature: ['node'],
    content: [
        `node.parentNode.removeChild(node);`,
    ],
});