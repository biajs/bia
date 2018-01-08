import { JsHelper } from '../../code/JsHelper';

/**
 * Next tick.
 * 
 * @return {JsFunction}
 */
export default new JsHelper({
    id: 'nextTick',
    name: 'nextTick',
    signature: ['cb'],
    content: [
        `Promise.resolve().then(cb);`,
    ],
});