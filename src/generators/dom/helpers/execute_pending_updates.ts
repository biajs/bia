import { JsHelper } from '../../code/JsHelper';

/**
 * Execute pending updates, and reset the changed state.
 * 
 * @return {JsFunction}
 */
export default new JsHelper({
    id: 'executePendingUpdates',
    name: 'executePendingUpdates',
    signature: ['onUpdate'],
    content: [
        // if we aren't updating state, do nothing
        `if (!isUpdating) return;`,

        // reset the changedState and isUpdating vars
        `onUpdate(changedState);`,
        `changedState = {};`,
        `isUpdating = false;`,

        // reset the nextTick queue, and execute pending callbacks
        `let fns = queue, i = 0, len = fns.length;`,
        `queue = [];`,
        `for (;i < len; i++) fns[i]();`,
    ],
});