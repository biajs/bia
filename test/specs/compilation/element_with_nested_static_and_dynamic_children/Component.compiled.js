// bia v0.0.0

function noop() {}

function appendNode(node, target) {
    target.appendChild(node);
}

function createText(text) {
    return document.createTextNode(text);
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
    var div, text, div_1;

    var if_block_1 = (true) && create_if_block_1(vm);
    return {
        c: function create() {
            div = createElement('div');
            if (if_block_1) if_block_1.c();
            text = createText('\r\n        static text\r\n        ');
            div_1 = createElement('div');
            div_1.innerHTML = '\r\n            nested static text\r\n            <p>nested static element</p>\r\n        ';
            return div;
        },
        d: noop,
        m: function mount(target, anchor) {
            insertNode(div, target, anchor);
            if (if_block_1) if_block_1.m(div, null);
            appendNode(text, div);
            appendNode(div_1, div);
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
            setText(span, 'dynamic');
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