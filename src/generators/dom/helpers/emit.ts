import { JsHelper } from '../../code/JsHelper';
import { JsIf } from '../../code/index';
import { indent } from '../../../utils/string';

/**
 * Emit an event.
 * 
 * @return {JsFunction}
 */
export default new JsHelper({
    id: 'emit',
    name: 'emit',
    signature: ['eventName', 'payload'],
    content: [
        `var handlers = eventName in this._handlers && this._handlers[eventName].slice();`,
        null,
        new JsIf({
            condition: 'handlers',
            content: [
                `for (var i = 0, len = handlers.length; i < len; i++) {`,
                indent(`handlers[i].call(this, payload);`),
                `}`,
            ],
        }),
    ],
});