// bia v0.0.0
function create_if_block(vm) {
    var span;

    return {
        c: function create() {
            span = createElement('span');

            span.textContent = 'dynamic child';

            this.h();

            vm.$el = span;
        },
        h: function hydrate() {
            setClass(span, 'baz');
        },
        m: function mount(target) {
            appendChild(target, span);
        }
    };
}

function createElement(tag) {
    return document.createElement(tag);
}

function setClass(el, className) {
    el.className = className;
}

function appendChild(target, el) {
    return target.appendChild(el);
}
function replaceNode(target, node) {
    target.replaceWith(node);
}

function noop() {}

function create_main_fragment(vm) {
    var div, span;

    var if_block = (true) && create_if_block(vm);

    return {
        c: function create() {
            div = createElement('div');
            span = createElement('span');

            if (if_block) if_block.c();
            span.textContent = 'static child';

            this.h();

            vm.$el = div;
        },
        h: function hydrate() {
            setClass(div, 'foo');
            setClass(span, 'bar');
        },
        m: function mount(target) {
            appendChild(target, div);
            appendChild(div, span);
            if (if_block) if_block.m(div);
        }
    };
}

function NodeWithDynamicChildren(options) {
    this.$fragment = create_main_fragment(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default NodeWithDynamicChildren;