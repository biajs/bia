// bia v0.0.0
function createElement(tag) {
    return document.createElement(tag);
}

function replaceNode(target, node) {
    target.replaceWith(node);
}

function noop() {}

function fragment8(vm, state) {
    var root;

    return {
        c: function create() {
            root = createElement('div');
            root.textContent = 'Foo\'s \"bar\"';
            vm.$el = root;
        },
        h: noop,
        m: function mount(target) {
            replaceNode(target, root);
        }
    };
}

function NodeWithQuotedText(options) {
    this.$fragment = fragment8(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default NodeWithQuotedText;