// bia v0.0.0

function noop() {}

function toggleVisibility(el, isVisible) {
    if (isVisible) el.style.removeProperty('display');
    else el.style.setProperty('display', 'none');
}

function appendNode(node, target) {
    target.appendChild(node);
}

function setText(el, text) {
    el.textContent = text;
}

function detachNode(node) {
    node.parentNode.removeChild(node);
}

function insertNode(node, target, anchor) {
    target.insertBefore(node, anchor);
}

function createElement(tag) {
    return document.createElement(tag);
}

function create_main_fragment(vm) {
    var div, p, span;

    return {
        c: function create() {
            div = createElement('div');
            p = createElement('p');
            setText(p, 'hidden');
            span = createElement('span');
            setText(span, 'visible');
            this.h();
            return div;
        },
        d: noop,
        h: function hydrate() {
            toggleVisibility(p, false);
            toggleVisibility(span, true);
        },
        m: function mount(target, anchor) {
            insertNode(div, target, anchor);
            appendNode(p, div);
            appendNode(span, div);
        },
        p: noop,
        u: function unmount() {
            detachNode(div);
        }
    };
}

function Component(options) {
    const fragment = create_main_fragment(this);
    
    if (options.el) {
        this.$el = fragment.c();
        fragment.m(options.el, options.anchor || null);
    }
}

export default Component;