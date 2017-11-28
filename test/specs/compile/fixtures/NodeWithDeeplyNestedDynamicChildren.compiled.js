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
    var root, span_0, div_0, span_1, div_1, span_2, div_2, p_0;

    return {
        c: function create() {
            root = createElement('div');
            span_0 = createElement('span');
            span_0.textContent = 'foo';
            div_0 = createElement('div');
            span_1 = createElement('span');
            span_1.textContent = 'bar';
            div_1 = createElement('div');
            span_2 = createElement('span');
            span_2.textContent = 'baz';
            div_2 = createElement('div');
            p_0 = createElement('p');
            p_0.textContent = 'yar';
            this.h();
            vm.$el = root;
        },
        h: function hydrate() {
            setClass(root, 'root')

            setClass(span_0, 'foo')
            setClass(div_0, 'foo')

            setClass(span_1, 'bar')
            setClass(div_1, 'bar')

            setClass(span_2, 'baz')
            setClass(div_2, 'baz')

            setClass(p_0, 'yar')
        },
        m: function mount(target) {
            replaceNode(target, root);
            root.appendChild(span_0);

            root.appendChild(div_0);
            div_0.appendChild(span_1);

            div_0.appendChild(div_1);
            div_1.appendChild(span_2);

            div_1.appendChild(div_2);
            div_2.appendChild(p_0);
        }
    };
}

function NodeWithDeeplyNestedDynamicChildren(options) {
    this.$fragment = fragment5(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default NodeWithDeeplyNestedDynamicChildren;