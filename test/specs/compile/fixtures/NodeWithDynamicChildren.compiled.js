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

function fragment5(vm, state) {
    var root, div_0, span_0;

    return {
        c: function create() {
            root = createElement('div');
            div_0 = createElement('div');
            span_0 = createElement('span');
            this.h();
            vm.$el = root;
        },
        h: function hydrate() {
            setClass(root, 'foo')

            setClass(div_0, 'bar')

            setClass(span_0, 'baz')
        },
        m: function mount(target) {
            replaceNode(target, root);
            root.appendChild(div_0);
            root.appendChild(span_0);
        }
    };
}

function NodeWithDynamicChildren(options) {
    this.$fragment = fragment5(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default NodeWithDynamicChildren;