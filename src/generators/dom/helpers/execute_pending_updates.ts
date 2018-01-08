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
        `if (!isUpdating) return;`,
        `isUpdating = false;`,
        `onUpdate(changedState);`,
        `changedState = {};`,
    ],
});