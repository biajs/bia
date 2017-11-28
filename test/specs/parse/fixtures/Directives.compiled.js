// bia v0.0.0
function createElement(tag) {
    return document.createElement(tag);
}

function replaceNode(target, node) {
    target.replaceWith(node);
}

function noop() {}

function fragment11(vm, state) {
    var root, span_0, span_1, span_2, span_3, span_4, span_5, span_6, span_7, span_8, span_9, span_10, span_11, span_12, span_13;

    return {
        c: function create() {
            root = createElement('div');
            span_0 = createElement('span');
            span_1 = createElement('span');
            span_2 = createElement('span');
            span_3 = createElement('span');
            span_4 = createElement('span');
            span_5 = createElement('span');
            span_6 = createElement('span');
            span_7 = createElement('span');
            span_8 = createElement('span');
            span_9 = createElement('span');
            span_10 = createElement('span');
            span_11 = createElement('span');
            span_12 = createElement('span');
            span_13 = createElement('span');
            this.h();
            vm.$el = root;
        },
        h: function hydrate() {

        },
        m: function mount(target) {
            replaceNode(target, root);
            root.appendChild(span_0);
            root.appendChild(span_1);
            root.appendChild(span_2);
            root.appendChild(span_3);
            root.appendChild(span_4);
            root.appendChild(span_5);
            root.appendChild(span_6);
            root.appendChild(span_7);
            root.appendChild(span_8);
            root.appendChild(span_9);
            root.appendChild(span_10);
            root.appendChild(span_11);
            root.appendChild(span_12);
            root.appendChild(span_13);
        }
    };
}

function Directives(options) {
    this.$fragment = fragment11(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default Directives;