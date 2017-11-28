// bia v0.0.0
function createElement(tag) {
    return document.createElement(tag);
}

function replaceNode(target, node) {
    target.replaceWith(node);
}

function noop() {}

function fragment13(vm, state) {
    var root, span_0;

    return {
        c: function create() {
            root = createElement('div');
            root.innerHTML = '\r\n        <span>hello</span>\r\n    ';
            vm.$el = root;
        },
        h: noop,
        m: function mount(target) {
            replaceNode(target, root);
        }
    };
}

function DiscardIndentation(options) {
    this.$fragment = fragment13(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default DiscardIndentation;