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

    var if_block_1 = (true) && create_if_block_1(vm);
    return {
        c: function create() {
            div = createElement('div');
            if (if_block_1) if_block_1.c();
            return div;
        },
        d: noop,
        m: function mount(target, anchor) {
            insertNode(div, target, anchor);
            if (if_block_1) if_block_1.m(div, null);
        },
        u: function unmount() {
            detachNode(div);
        },
        p: noop
    };
}

function create_if_block_5(vm) {
    var u;

    return {
        c: function create() {
            u = createElement('u');
            setText(u, 'no');
            return u;
        },
        d: noop,
        m: function mount(target, anchor) {
            insertNode(u, target, anchor);
        },
        u: function unmount() {
            detachNode(u);
        },
        p: noop
    };
}

function create_if_block_3(vm) {
    var i;

    return {
        c: function create() {
            i = createElement('i');
            setText(i, 'yes');
            return i;
        },
        d: noop,
        m: function mount(target, anchor) {
            insertNode(i, target, anchor);
        },
        u: function unmount() {
            detachNode(i);
        },
        p: noop
    };
}

function create_if_block_2(vm) {
    var span;

    var if_block_3 = (true) && create_if_block_3(vm);
    var if_block_5 = (false) && create_if_block_5(vm);
    return {
        c: function create() {
            span = createElement('span');
            if (if_block_3) if_block_3.c();
            if (if_block_5) if_block_5.c();
            return span;
        },
        d: noop,
        m: function mount(target, anchor) {
            insertNode(span, target, anchor);
            if (if_block_3) if_block_3.m(span, null);
            if (if_block_5) if_block_5.m(span, null);
        },
        u: function unmount() {
            detachNode(span);
        },
        p: noop
    };
}

function create_if_block_1(vm) {
    var p;

    var if_block_2 = (true) && create_if_block_2(vm);
    return {
        c: function create() {
            p = createElement('p');
            if (if_block_2) if_block_2.c();
            return p;
        },
        d: noop,
        m: function mount(target, anchor) {
            insertNode(p, target, anchor);
            if (if_block_2) if_block_2.m(p, null);
        },
        u: function unmount() {
            detachNode(p);
        },
        p: noop
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