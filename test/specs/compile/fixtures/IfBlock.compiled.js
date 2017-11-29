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

function replaceNode(target, node) {
    target.replaceWith(node);
}

function noop() {}

function create_root_fragment(vm) {
    var root, text;

    var if_block = (foo) && create_if_block(vm);

    return {
        c: function create() {
            root = createElement('main');
            if (if_block) if_block.c();
            this.h();
            vm.$el = root;
        },
        h: function hydrate() {

        },
        m: function mount(target) {
            replaceNode(target, root);
            if (if_block) if_block.m(root)
        }
    };
}

function IfBlock(options) {
    this.$fragment = create_root_fragment(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default IfBlock;