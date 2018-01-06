import { JsAssignment, JsCode, JsFunction } from '../../code/index';

export default new JsCode({
    content: [
        // constructor
        new JsFunction({
            name: 'Watcher',
            signature: ['getter', 'cb'],
            content: [
                `this.getter = getter;`,
                `this.cb = cb;`,
                `this.value = this.get();`,
                `this.cb(this.value, null)`,
            ],
        }),
        null,

        // get
        new JsAssignment({
            left: 'Watcher.prototype.get',
            right: new JsFunction({
                content: [
                    `pushTarget(this);`,
                    `var value = this.getter();`,
                    `popTarget();`,
                    `return value;`,
                ],
            }),
        }),
        null,

        // add a dependency
        new JsAssignment({
            left: 'Watcher.prototype.addDep',
            right: new JsFunction({
                signature: ['dep'],
                content: [`dep.addSub(this);`],
            }),
        }),
        null,

        // update a watcher
        new JsAssignment({
            left: 'Watcher.prototype.update',
            right: new JsFunction({
                content: [
                    `var value = this.get(), oldValue = this.value;`,
                    `this.value = value;`,
                    `this.cb(value, oldValue);`,
                ],
            }),
        }),
    ],
});