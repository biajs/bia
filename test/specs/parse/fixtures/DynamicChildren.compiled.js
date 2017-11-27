// bia v0.0.0
function createElement(tag) {
    return document.createElement(tag);
}

function replaceNode(target, node) {
    target.replaceWith(node);
}

function noop() {}

function fragment13(vm, state) {
    var div;

    return {
        c: function c() {
            div = createElement('div');
            div_1 = createElement('div');
            div_2 = createElement('div');
            vm.$el = div;
        },
        h: noop,
        m: function m(target) {
            replaceNode(target, div);
        }
    };
}

function DynamicChildren(options) {
    this.$fragment = fragment13(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default DynamicChildren;