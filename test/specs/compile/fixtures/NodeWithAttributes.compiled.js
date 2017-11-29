// bia v0.0.0
function createElement(tag) {
    return document.createElement(tag);
}

function setClass(el, className) {
    el.className = className;
}

function setStyle(el, name, value) {
    el.style.setProperty(name, value);
}

function replaceNode(target, node) {
    target.replaceWith(node);
}

function noop() {}

function create_root_fragment(vm) {
    var root;

    return {
        c: function create() {
            root = createElement('div');
            this.h();
            vm.$el = root;
        },
        h: function hydrate() {
            setClass(root, 'foo')

            setStyle(root, 'color', 'red');
        },
        m: function mount(target) {
            replaceNode(target, root);
        }
    };
}

function NodeWithAttributes(options) {
    this.$fragment = create_root_fragment(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default NodeWithAttributes;