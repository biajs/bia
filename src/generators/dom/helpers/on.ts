import { JsHelper } from '../../code/JsHelper';
import { JsFunction, JsObject, JsReturn } from '../../code/index';

/**
 * Initialize a component.
 * 
 * @return {JsFunction}
 */
export default new JsHelper({
    id: 'on',
    name: 'on',
    signature: ['eventName', 'handler'],
    content: [
        `var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);`,
        null,
        `handlers.push(handler);`,
        null,
        new JsReturn({
            value: new JsObject({
                properties: {
                    cancel: new JsFunction({
                        content: [
                            `var index = handlers.indexOf(handler);`,
                            `if (~index) handlers.splice(index, 1);`,
                        ],
                    }) ,
                },
            }),
        }),
    ],
});