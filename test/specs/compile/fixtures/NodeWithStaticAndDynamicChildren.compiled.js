// bia v0.0.0
function appendNode(node, target) {
    target.appendChild(node);
}

function createText(text) {
    return document.createTextNode(text);
}

function insertNode(node, target, anchor) {
    target.insertBefore(node, anchor);
}

function setText(el, text) {
    el.textContent = text;
}

function createElement(tag) {
    return document.createElement(tag);
}

function noop() {}

function create_if_block(vm) {
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
        u: noop
    };
}
function create_main_fragment(vm) {
    var div, text, span;

    var if_block = (false) && create_if_block(vm);
    
    return {
        c: function create() {
            div = createElement('div');
            text = createText('\r\n        text node\r\n        ');
            span = createElement('span');
            setText(span, 'static');
            if (if_block) if_block.c();
            
            return div;
        },
        d: noop,
        h: noop,
        m: function mount(target, anchor) {
            insertNode(div, target, anchor);
            appendNode(text, div);
            appendNode(span, div);
            if (if_block) if_block.m(div, null);
        },
        p: noop,
        u: noop
    };
}

function NodeWithStaticAndDynamicChildren(options) {
    this.$fragment = create_main_fragment(this);
    
    if (options.el) {
        this.$el = this.$fragment.c();
        this.$fragment.m(options.el, options.anchor || null);
    }
}

export default NodeWithStaticAndDynamicChildren;