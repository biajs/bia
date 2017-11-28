// bia v0.0.0
function setStyle(el, name, value) {
    el.style.setProperty(name, value);
}

function createElement(tag) {
    return document.createElement(tag);
}

function replaceNode(target, node) {
    target.replaceWith(node);
}

function noop() {}

function fragment21(vm, state) {
    var root;

    return {
        c: function create() {
            root = createElement('div');
            this.h();
            vm.$el = root;
        },
        h: function hydrate() {
            setStyle(root, 'color', 'red');
            setStyle(root, 'font-size', '20px');
        },
        m: function mount(target) {
            replaceNode(target, root);
        }
    };
}

function NodeWithStaticStyles(options) {
    this.$fragment = fragment21(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default NodeWithStaticStyles;