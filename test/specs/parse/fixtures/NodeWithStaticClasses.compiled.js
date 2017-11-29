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

function fragment21(vm) {
    var root;

    return {
        c: function create() {
            root = createElement('div');
            this.h();
            vm.$el = root;
        },
        h: function hydrate() {
            setClass(root, 'foo bar')
        },
        m: function mount(target) {
            replaceNode(target, root);
        }
    };
}

function NodeWithStaticClasses(options) {
    this.$fragment = fragment21(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default NodeWithStaticClasses;