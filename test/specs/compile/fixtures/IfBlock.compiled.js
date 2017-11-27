// bia v0.0.0
function createElement(tag) {
    return document.createElement(tag);
}

function replaceNode(target, node) {
    target.replaceWith(node);
}

function noop() {}

function fragment1(vm, state) {
    var main;

    return {
        c: function c() {
            div = createElement('main');
            div_1 = createElement('div');
            vm.$el = div;
        },
        h: noop,
        m: function m(target) {
            replaceNode(target, div);
        }
    };
}

function IfBlock(options) {
    this.$fragment = fragment1(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default IfBlock;