import { compile, div, expect, render } from '../../../utils';
const sinon = require('sinon');

export default function(file) {
    it.skip('event_subscription', function() {
        // const { code } = compile(file);
        // console.log(code);

        const vm = render(file, { el: div() });

        const stub1 = sinon.stub();
        const stub2 = sinon.stub();
        const listener1 = vm.$on('foo', stub1);
        const listener2 = vm.$on('foo', stub2);

        // emit an event to call both listeners
        vm.$emit('foo', 'one');
        expect(stub1).to.have.been.calledWith('one');
        expect(stub2).to.have.been.calledWith('one');

        // reset our stubs, and cancel the first listener
        stub1.reset();
        stub2.reset();
        listener1.cancel();

        // emit an event that should now only hit the second listener
        vm.$emit('foo', 'two');
        expect(stub1).not.to.have.been.called;
        expect(stub2).to.have.been.calledWith('two');
    });
}