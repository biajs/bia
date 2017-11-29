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
            setClass(root, 'yar')
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
    var root, span, text, div, span_0, text_0, div_0, span_1, text_1, div_1, text_2;

    var if_block = (true) && create_if_block(vm);

    return {
        c: function create() {
            root = createElement('div');
            span = createElement('span');
            span.textContent = 'foo';
            div = createElement('div');
            span_0 = createElement('span');
            span_0.textContent = 'bar';
            div_0 = createElement('div');
            span_1 = createElement('span');
            span_1.textContent = 'baz';
            div_1 = createElement('div');
            if (if_block) if_block.c();
            this.h();
            vm.$el = root;
        },
        h: function hydrate() {
            setClass(root, 'root')

            setClass(span, 'foo')
            setClass(div, 'foo')

            setClass(span_0, 'bar')
            setClass(div_0, 'bar')

            setClass(span_1, 'baz')
            setClass(div_1, 'baz')

            setClass(if_block, 'yar')
        },
        m: function mount(target) {
            replaceNode(target, root);
            root.appendChild(span);

            root.appendChild(div);
            div.appendChild(span_0);

            div.appendChild(div_0);
            div_0.appendChild(span_1);

            div_0.appendChild(div_1);
            if (if_block) if_block.m(div_1)
        }
    };
}

function NodeWithDeeplyNestedDynamicChildren(options) {
    this.$fragment = create_root_fragment(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default NodeWithDeeplyNestedDynamicChildren;