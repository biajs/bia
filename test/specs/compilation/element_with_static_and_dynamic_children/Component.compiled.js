// bia v0.0.0

function noop() {}

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
    var div, p, p_1;

    var if_block_3 = (true) && create_if_block_3(vm);
    return {
        c: function create() {
            div = createElement('div');
            p = createElement('p');
            setText(p, 'static 1');
            if (if_block_3) if_block_3.c();
            p_1 = createElement('p');
            setText(p_1, 'static 2');
            return div;
        },
        d: noop,
        h: noop,
        m: function mount(target, anchor) {
            insertNode(div, target, anchor);
            appendNode(p, div);
            if (if_block_3) if_block_3.m(div, null);
            appendNode(p_1, div);
        },
        p: noop,
        u: function unmount() {
            detachNode(div);
        }
    };
}

function create_if_block_3(vm) {
    var span;

    return {
        c: function create() {
            span = createElement('span');
            setText(span, 'dynamic');
            return span;
        },
        d: noop,
        h: noop,
        m: function mount(target, anchor) {
            insertNode(span, target, anchor);
        },
        p: noop,
        u: function unmount() {
            detachNode(span);
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