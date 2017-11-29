// bia v0.0.0
function create_if_block(vm) {
    var text;

    return {
        c: function create() {
            if (root) root.c();
            this.h();
            vm.$el = root;
        },
        h: function hydrate() {
            setClass(root, 'baz')
        },
        m: function mount(target) {
            replaceNode(target, root);
        }
    };
}

function createElement(tag) {
    return document.createElement(tag);
}

function setClass(el, className) {
    el.className = className;
}

function replaceNode(target, node) {
    target.replaceWith(node);
}

function noop() {}

function create_root_fragment(vm) {
    var root, span, text, text_0;

    var if_block = (true) && create_if_block(vm);

    return {
        c: function create() {
            root = createElement('div');
            span = createElement('span');
            span.textContent = 'static child';
            if (if_block) if_block.c();
            this.h();
            vm.$el = root;
        },
        h: function hydrate() {
            setClass(root, 'foo')

            setClass(span, 'bar')
            setClass(if_block, 'baz')
        },
        m: function mount(target) {
            replaceNode(target, root);
            root.appendChild(span);

            if (if_block) if_block.m(root)
        }
    };
}

function NodeWithDynamicChildren(options) {
    this.$fragment = create_root_fragment(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default NodeWithDynamicChildren;