// bia v0.0.0
function createElement(tag) {
    return document.createElement(tag);
}

function replaceNode(target, node) {
    target.replaceWith(node);
}

function noop() {}

function fragment11(vm, state) {
    var root, span_0;

    return {
        c: function create() {
            root = createElement('div');
            root.innerHTML = '\r\n        <span>3</span>\r\n    ';
            vm.$el = root;
        },
        h: noop,
        m: function mount(target) {
            replaceNode(target, root);
        }
    };
}

function NodeWithTextExpressionInChild(options) {
    this.$fragment = fragment11(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default NodeWithTextExpressionInChild;