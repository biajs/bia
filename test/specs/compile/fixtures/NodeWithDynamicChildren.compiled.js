// bia v0.0.0
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

function fragment7(vm) {
    var root, span, text, if_block, text_0;

    return {
        c: function create() {
            root = createElement('div');
            span = createElement('span');
            span.textContent = 'static child';
            if_block = createElement('span');
            if_block.textContent = 'dynamic child';
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

            root.appendChild(if_block);
        }
    };
}

function NodeWithDynamicChildren(options) {
    this.$fragment = fragment7(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default NodeWithDynamicChildren;