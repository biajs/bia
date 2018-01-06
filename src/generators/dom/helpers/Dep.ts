import { JsAssignment, JsCode, JsFunction } from '../../code/index';

export default new JsCode({
    content: [
        // constructor
        new JsFunction({
            name: 'Dep',
            content: [
                `// @todo: refactor this to something that will work below ie11`,
                `this.subs = new Set();`,
            ],
        }),
        null,

        // add a subscriber
        new JsAssignment({
            left: 'Dep.prototype.addSub',
            right: new JsFunction({
                signature: ['sub'],
                content: [`this.subs.add(sub);`],
            }),
        }),
        null,

        // set the current dep target
        new JsAssignment({
            left: 'Dep.prototype.depend',
            right: new JsFunction({
                content: [`if (Dep.target) Dep.target.addDep(this);`],
            }),
        }),
        null,

        // notify subscribers that a dependency has changed
        new JsAssignment({
            left: 'Dep.prototype.notify',
            right: new JsFunction({
                content: [`this.subs.forEach(sub => sub.update());`],
            }),
        }),
        null,

        // the current target watcher being evaluated. this is globally unique 
        // because there could be only one watcher being evaluated at any time.
        `Dep.target = null;`,
        null,
        `var targetStack = [];`,
        null,

        new JsFunction({
            name: 'pushTarget',
            signature: ['_target'],
            content: [
                `if (Dep.target) targetStack.push(Dep.target);`,
                `Dep.target = _target;`,
            ],
        }),
        null,

        new JsFunction({
            name: 'popTarget',
            content: [`Dep.target = targetStack.pop();`],
        }),
    ],
})