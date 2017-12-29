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
    var div, span, span_1, span_2, span_3, span_4, span_5, span_6, span_7, span_8, span_9, span_10, span_11, span_12, span_13;

    return {
        c: function create() {
            div = createElement('div');
            span = createElement('span');
            setText(span, '0');
            span_1 = createElement('span');
            setText(span_1, '1');
            span_2 = createElement('span');
            setText(span_2, '2');
            span_3 = createElement('span');
            setText(span_3, '3');
            span_4 = createElement('span');
            setText(span_4, '4');
            span_5 = createElement('span');
            setText(span_5, '5');
            span_6 = createElement('span');
            setText(span_6, '6');
            span_7 = createElement('span');
            setText(span_7, '7');
            span_8 = createElement('span');
            setText(span_8, '8');
            span_9 = createElement('span');
            setText(span_9, '9');
            span_10 = createElement('span');
            setText(span_10, '10');
            span_11 = createElement('span');
            setText(span_11, '11');
            span_12 = createElement('span');
            setText(span_12, '12');
            span_13 = createElement('span');
            setText(span_13, '13');
            return div;
        },
        d: noop,
        h: noop,
        m: function mount(target, anchor) {
            insertNode(div, target, anchor);
            appendNode(span, div);
            appendNode(span_1, div);
            appendNode(span_2, div);
            appendNode(span_3, div);
            appendNode(span_4, div);
            appendNode(span_5, div);
            appendNode(span_6, div);
            appendNode(span_7, div);
            appendNode(span_8, div);
            appendNode(span_9, div);
            appendNode(span_10, div);
            appendNode(span_11, div);
            appendNode(span_12, div);
            appendNode(span_13, div);
        },
        p: noop,
        u: function unmount() {
            detachNode(div);
        }
    };
}

function Directives(options) {
    const fragment = create_main_fragment(this);
    
    if (options.el) {
        this.$el = fragment.c();
        fragment.m(options.el, options.anchor || null);
    }
}

export default Directives;