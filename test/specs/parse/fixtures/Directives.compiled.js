// bia v0.0.0
function createElement(tag) {
    return document.createElement(tag);
}

function replaceNode(target, node) {
    target.replaceWith(node);
}

function noop() {}

function fragment13(vm, state) {
    var root, span_0, text_0, span_1, text_1, span_2, text_2, span_3, text_3, span_4, text_4, span_5, text_5, span_6, text_6, span_7, text_7, span_8, text_8, span_9, text_9, span_10, text_10, span_11, text_11, span_12, text_12, span_13, text_13;

    return {
        c: function create() {
            root = createElement('div');
            span_0 = createElement('span');
            span_0.textContent = '0';
            span_1 = createElement('span');
            span_1.textContent = '1';
            span_2 = createElement('span');
            span_2.textContent = '2';
            span_3 = createElement('span');
            span_3.textContent = '3';
            span_4 = createElement('span');
            span_4.textContent = '4';
            span_5 = createElement('span');
            span_5.textContent = '5';
            span_6 = createElement('span');
            span_6.textContent = '6';
            span_7 = createElement('span');
            span_7.textContent = '7';
            span_8 = createElement('span');
            span_8.textContent = '8';
            span_9 = createElement('span');
            span_9.textContent = '9';
            span_10 = createElement('span');
            span_10.textContent = '10';
            span_11 = createElement('span');
            span_11.textContent = '11';
            span_12 = createElement('span');
            span_12.textContent = '12';
            span_13 = createElement('span');
            span_13.textContent = '13';
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
    this.$fragment = fragment13(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default Directives;