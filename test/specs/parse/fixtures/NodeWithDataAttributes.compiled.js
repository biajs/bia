// bia v0.0.0
function createElement(tag) {
    return document.createElement(tag);
}

function replaceNode(target, node) {
    target.replaceWith(node);
}

function noop() {}

function fragment17(vm, state) {
    var div;

    return {
        c: function c() {
            div = createElement('div');

            this.h();
            vm.$el = div;
        },
        h: function h() {
            div.dataset.foo = 'bar'
            div.dataset.helloWorld = 'yar'
        },
        m: function m(target) {
            replaceNode(target, div);
        }
    };
}

function NodeWithDataAttributes(options) {
    this.$fragment = fragment17(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default NodeWithDataAttributes;