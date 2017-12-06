// bia v0.0.0
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

function create_if_block_2(vm) {
    var span;

    return {
        c: function create() {
            span = createElement('span');
            setText(span, 'hooray');
            
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
        h: noop,
        m: function mount(target, anchor) {
            insertNode(p, target, anchor);
            if (if_block_2) if_block_2.m(p, null);
        },
        p: noop,
        u: noop
    };
}
function create_if_block(vm) {
    var div;

    var if_block_1 = (true) && create_if_block_1(vm);
    
    return {
        c: function create() {
            div = createElement('div');
            if (if_block_1) if_block_1.c();
            
            return div;
        },
        d: noop,
        h: noop,
        m: function mount(target, anchor) {
            insertNode(div, target, anchor);
            if (if_block_1) if_block_1.m(div, null);
        },
        p: noop,
        u: noop
    };
}
function create_main_fragment(vm) {
    var div;

    var if_block = (true) && create_if_block(vm);
    
    return {
        c: function create() {
            div = createElement('div');
            if (if_block) if_block.c();
            
            return div;
        },
        d: noop,
        h: noop,
        m: function mount(target, anchor) {
            insertNode(div, target, anchor);
            if (if_block) if_block.m(div, null);
        },
        p: noop,
        u: noop
    };
}

function NestedIfBlock(options) {
    this.$fragment = create_main_fragment(this);
    
    if (options.el) {
        this.$el = this.$fragment.c();
        this.$fragment.m(options.el, options.anchor || null);
    }
}

export default NestedIfBlock;