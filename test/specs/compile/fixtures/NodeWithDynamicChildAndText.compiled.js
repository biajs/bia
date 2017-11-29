// bia v0.0.0
function create_if_block(vm) {
    var text;

    return {
        c: function create() {
            if (root) root.c();
            vm.$el = root;
        },
        h: noop,
        m: function mount(target) {
            replaceNode(target, root);
        }
    };
}

function createElement(tag) {
    return document.createElement(tag);
}

function createText(text) {
    return document.createTextNode(text);
}

function replaceNode(target, node) {
    target.replaceWith(node);
}

function noop() {}

function create_root_fragment(vm) {
    var root, text, text_0;

    var if_block = (true) && create_if_block(vm);

    return {
        c: function create() {
            root = createElement('div');
            text = createText('\r\n        foo\r\n        ');
            if (if_block) if_block.c();
            this.h();
            vm.$el = root;
        },
        h: function hydrate() {

        },
        m: function mount(target) {
            replaceNode(target, root);
            root.appendChild(text);

            if (if_block) if_block.m(root)
        }
    };
}

function NodeWithDynamicChildAndText(options) {
    this.$fragment = create_root_fragment(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default NodeWithDynamicChildAndText;