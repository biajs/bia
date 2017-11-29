// bia v0.0.0
function createElement(tag) {
    return document.createElement(tag);
}

function replaceNode(target, node) {
    target.replaceWith(node);
}

function noop() {}

function fragment14(vm) {
    var root, span, text;

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
    this.$fragment = fragment14(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default DiscardIndentation;