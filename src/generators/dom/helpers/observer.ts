import { 
    JsAssignment, 
    JsCode, 
    JsFunction,
    JsIf,
} from '../../code/index';

/**
 * Dependency.
 * 
 * @return {JsFunction}
 */
export const Dep = new JsCode({
    content: [
        // constructor
        new JsFunction({
            name: 'Dep',
            content: [`this.subs = new Set();`],
        }),
        null,

        // add a subscriber
        new JsAssignment({
            left: 'Dep.prototype.addSub',
            right: new JsFunction({
                content: [`this.subs.add(sub);`],
            }),
        }),
        null,

        // depend
        new JsAssignment({
            left: 'Dep.prototype.depend',
            right: new JsFunction({
                content: [
                    new JsIf({
                        condition: 'Dep.target',
                        content: [`Dep.target.addDep(this);`],
                    }),
                ],
            }),
        }),
        null,

        // notify
        new JsAssignment({
            left: 'Dep.prototype.notify',
            right: new JsFunction({
                content: [`this.subs.forEach(sub => sub.update());`],
            }),
        }),
        null,

        // the current target watcher being evaluated. this is globally
        // unique because there can only be one watcher evaluated at a time
        `Dep.target = null;`,
        `var targetStack = [];`,
        null,

        new JsFunction({
            name: 'pushTarget',
            signature: ['_target'],
            content: [
                `if (Dep.target) targetStack.push(Dep.target);`,
                `Dep.target = _target`,
            ],
        }),
        null,

        new JsFunction({
            name: 'popTarget',
            content: [`Dep.target = targetStack.pop();`],
        }),
    ],
});

/**
 * Watcher
 * 
 * @return {JsFunction}
 */
export const Watcher = new JsCode({
    content: [
        // constructor
        new JsFunction({
            name: 'Watcher',
            signature: ['getter', 'cb'],
            content: [
                `this.getter = getter;`,
                `this.cb = cb;`,
                `this.value = this.get();`,
                `this.cb(this.value, null);`,
            ],
        }),
        null,

        // add dependency
        new JsAssignment({
            left: 'Watcher.prototype.addDep',
            right: new JsFunction({
                signature: ['dep'],
                content: [`dep.addSub(this);`],
            }),
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

        // update
        new JsAssignment({
            left: 'Watcher.prototype.update',
            right: new JsFunction({
                content: [
                    `const value = this.get();`,
                    `const oldValue = this.value;`,
                    `this.value = value;`,
                    `this.cb(value, oldValue);`,
                ],
            }),
        }),
    ],
});