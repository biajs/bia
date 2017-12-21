// bia v0.0.0

function noop() {}

function detachNode(node) {
    node.parentNode.removeChild(node);
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

function create_main_fragment(vm) {
    var div;

    return {
        c: function create() {
            div = createElement("div");
            setText(div, '{{ 2 + 2 }}');
            return div;
        },
        d: noop,
        m: function mount(target, anchor) {
            insertNode(div, target, anchor);
        },
        u: function unmount() {
            detachNode(div);
        },
        p: noop
    };
}

function NodeWithTextExpression(options) {
    const fragment = create_main_fragment(this);
    
    if (options.el) {
        this.$el = fragment.c();
        fragment.m(options.el, options.anchor || null);
    }
}

export default NodeWithTextExpression;