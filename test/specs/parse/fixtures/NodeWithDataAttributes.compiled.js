// bia v0.0.0
function createElement(tag) {
    return document.createElement(tag);
}

function replaceNode(target, node) {
    target.replaceWith(node);
}

function noop() {}

function createFragment12(vm, state) {
    var div;

    return {
        c: function c() {
            div = createElement('div');
            vm.$el = div;

            this.h();

            return div;
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
    this.$fragment = createFragment12(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default NodeWithDataAttributes;