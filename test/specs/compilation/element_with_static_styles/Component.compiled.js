// bia v0.0.0

function noop() {}

function setStyle(el, key, value) {
    el.style.setProperty(key, value);
}

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
    var div, p;

    var if_block_2 = (true) && create_if_block_2(vm);
    return {
        c: function create() {
            div = createElement('div');
            p = createElement('p');
            if (if_block_2) if_block_2.c();
            this.h();
            return div;
        },
        d: noop,
        h: function hydrate() {
            setStyle(p, 'color', 'red');
        },
        m: function mount(target, anchor) {
            insertNode(div, target, anchor);
            appendNode(p, div);
            if (if_block_2) if_block_2.m(div, null);
        },
        p: noop,
        u: function unmount() {
            detachNode(div);
        }
    };
}

function create_if_block_2(vm) {
    var p;

    return {
        c: function create() {
            p = createElement('p');
            p.innerHTML = '\r\n            <span style=\"color: blue\"></span>\r\n        ';
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