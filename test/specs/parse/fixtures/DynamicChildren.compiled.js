// bia v0.0.0
function setClass(el, className) {
    el.className = className;
}

function createElement(tag) {
    return document.createElement(tag);
}

function replaceNode(target, node) {
    target.replaceWith(node);
}

function noop() {}

function fragment13(vm, state) {
    var root, div_0, div_1;

    return {
        c: function create() {
            root = createElement('div');
            div_0 = createElement('div');
            div_1 = createElement('div');
            this.h();
            vm.$el = root;
        },
        h: function hydrate() {
            setClass(div_0, 'static')
        },
        m: function mount(target) {
            replaceNode(target, root);
            root.appendChild(div_0);
            root.appendChild(div_1);
        }
    };
}

function DynamicChildren(options) {
    this.$fragment = fragment13(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default DynamicChildren;