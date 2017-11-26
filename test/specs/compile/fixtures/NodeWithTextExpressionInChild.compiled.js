// bia v0.0.0
function createElement(tag) {
    return document.createElement(tag);
}

function replaceNode(target, node) {
    target.replaceWith(node);
}

function noop() {}

function createFragment7(vm, state) {
    var div;

    return {
        c: function c() {
            div = createElement('div');
            vm.$el = div;

            div.innerHTML = '\r\n        <span>3</span>\r\n    ';

            return div;
        },
        h: noop,
        m: function m(target) {
            replaceNode(target, div);
        }
    };
}

function NodeWithTextExpressionInChild(options) {
    this.$fragment = createFragment7(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default NodeWithTextExpressionInChild;