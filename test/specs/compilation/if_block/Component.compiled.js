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
            // hmmm
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

function create_if_block_1(vm) {
    var span;

    return {
        c: function create() {
            span = createElement('span');
            setText(span, 'hello');
            return span;
        },
        d: noop,
        m: function mount(target, anchor) {
            insertNode(span, target, anchor);
        },
        u: function unmount() {
            detachNode(span);
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