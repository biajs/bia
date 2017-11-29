// bia v0.0.0
function createElement(tag) {
    return document.createElement(tag);
}

function replaceNode(target, node) {
    target.replaceWith(node);
}

function noop() {}

function create_root_fragment(vm) {
    var root, text;

    return {
        c: function create() {
            root = createElement('div');
            root.textContent = '\r\n        Hello world\r\n        foo bar baz\r\n    ';
            vm.$el = root;
        },
        h: noop,
        m: function mount(target) {
            replaceNode(target, root);
        }
    };
}

function NodeWithMultipleLinesOfText(options) {
    this.$fragment = create_root_fragment(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default NodeWithMultipleLinesOfText;