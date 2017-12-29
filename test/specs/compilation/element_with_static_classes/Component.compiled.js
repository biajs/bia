// bia v0.0.0

function noop() {}

function appendNode(node, target) {
    target.appendChild(node);
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
    var div, span;

    var if_block_1 = (false) && create_if_block_1(vm);
    return {
        c: function create() {
            div = createElement('div');
            if (if_block_1) if_block_1.c();
            span = createElement('span');
            this.h();
            return div;
        },
        d: noop,
        h: function hydrate() {
            span.className = 'foo bar';
        },
        m: function mount(target, anchor) {
            insertNode(div, target, anchor);
            if (if_block_1) if_block_1.m(div, null);
            appendNode(span, div);
        },
        p: noop,
        u: function unmount() {
            detachNode(div);
        }
    };
}

function create_if_block_1(vm) {
    var p;

    return {
        c: function create() {
            p = createElement('p');
            return p;
        },
        d: noop,
        h: noop,
        m: function mount(target, anchor) {
            insertNode(p, target, anchor);
        },
        p: noop,
        u: function unmount() {
            detachNode(p);
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