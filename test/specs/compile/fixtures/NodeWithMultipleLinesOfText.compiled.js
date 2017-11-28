// bia v0.0.0
function createElement(tag) {
    return document.createElement(tag);
}

function replaceNode(target, node) {
    target.replaceWith(node);
}

function noop() {}

function fragment6(vm, state) {
    var root;

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
    this.$fragment = fragment6(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default NodeWithMultipleLinesOfText;