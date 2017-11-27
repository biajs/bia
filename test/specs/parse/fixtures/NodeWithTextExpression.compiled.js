// bia v0.0.0
function createElement(tag) {
    return document.createElement(tag);
}

function replaceNode(target, node) {
    target.replaceWith(node);
}

function noop() {}

function fragment19(vm, state) {
    var div;

    return {
        c: function c() {
            div = createElement('div');
            vm.$el = div;
            div.textContent = '4';

            return div;
        },
        h: noop,
        m: function m(target) {
            replaceNode(target, div);
        }
    };
}

function NodeWithTextExpression(options) {
    this.$fragment = fragment19(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default NodeWithTextExpression;