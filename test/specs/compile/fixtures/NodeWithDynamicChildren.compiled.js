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

function fragment7(vm, state) {
    var root, span_0, text_0, span_1, text_1;

    return {
        c: function create() {
            root = createElement('div');
            span_0 = createElement('span');
            span_0.textContent = 'static child';
            span_1 = createElement('span');
            span_1.textContent = 'dynamic child';
            this.h();
            vm.$el = root;
        },
        h: function hydrate() {
            setClass(root, 'foo')

            setClass(span_0, 'bar')
            setClass(span_1, 'baz')
        },
        m: function mount(target) {
            replaceNode(target, root);
            root.appendChild(span_0);

            root.appendChild(span_1);
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