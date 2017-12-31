// bia v0.0.0

function noop() {}

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
    var div;

    var current_block_type = select_block_type(vm);
    var if_block = current_block_type(vm);
    return {
        c: function create() {
            div = createElement('div');
            if_block.c();
            return div;
        },
        d: noop,
        h: noop,
        m: function mount(target, anchor) {
            insertNode(div, target, anchor);
            if_block.m(div, null);
        },
        p: noop,
        u: function unmount() {
            detachNode(div);
        }
    };
}

function create_else_block(vm) {
    var p;

    return {
        c: function create() {
            p = createElement('p');
            setText(p, '3');
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

function create_else_if_block(vm) {
    var p;

    return {
        c: function create() {
            p = createElement('p');
            setText(p, '2');
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

function create_if_block(vm) {
    var p;

    return {
        c: function create() {
            p = createElement('p');
            setText(p, '1');
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

function select_block_type(vm) {
    if (false) return create_if_block;
    if (true) return create_else_if_block;
    return create_else_block;
}

export default Component;