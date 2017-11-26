// bia v0.0.0
function createElement(tag) {
    return document.createElement(tag);
}

function replaceNode(target, node) {
    target.replaceWith(node);
}

function noop() {}

function createFragment13(vm, state) {
    var div;

    return {
        c: function c() {
            div = createElement('div');
            vm.$el = div;
            div.textContent = 'Hello world';

            return div;
        },
        h: noop,
        m: function m(target) {
            replaceNode(target, div);
        }
    };
}

function NodeWithText(options) {
    this.$fragment = createFragment13(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default NodeWithText;