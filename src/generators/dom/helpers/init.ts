import { JsHelper } from '../../code/JsHelper';

/**
 * Initialize a component.
 * 
 * @return {JsFunction}
 */
export default new JsHelper({
    id: 'init',
    name: 'init',
    signature: ['vm', 'options'],
    content: [
        `vm.$options = options;`,
    ],
});