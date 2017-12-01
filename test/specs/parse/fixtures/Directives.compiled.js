// bia v0.0.0
function createElement(tag) {
    return document.createElement(tag);
}

function appendChild(target, el) {
    return target.appendChild(el);
}
function replaceNode(target, node) {
    target.replaceWith(node);
}

function noop() {}

function create_main_fragment(vm) {
    var div, span, span_1, span_2, span_3, span_4, span_5, span_6, span_7, span_8, span_9, span_10, span_11, span_12, span_13;

    return {
        c: function create() {
            div = createElement('div');
            span = createElement('span');
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

            span.textContent = '0';
            span_1.textContent = '1';
            span_2.textContent = '2';
            span_3.textContent = '3';
            span_4.textContent = '4';
            span_5.textContent = '5';
            span_6.textContent = '6';
            span_7.textContent = '7';
            span_8.textContent = '8';
            span_9.textContent = '9';
            span_10.textContent = '10';
            span_11.textContent = '11';
            span_12.textContent = '12';
            span_13.textContent = '13';

            this.h();

            vm.$el = div;
        },
        h: noop,
        m: function mount(target) {
            appendChild(target, div);
            appendChild(div, span);
            appendChild(div, span_1);
            appendChild(div, span_2);
            appendChild(div, span_3);
            appendChild(div, span_4);
            appendChild(div, span_5);
            appendChild(div, span_6);
            appendChild(div, span_7);
            appendChild(div, span_8);
            appendChild(div, span_9);
            appendChild(div, span_10);
            appendChild(div, span_11);
            appendChild(div, span_12);
            appendChild(div, span_13);
        }
    };
}

function Directives(options) {
    this.$fragment = create_main_fragment(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default Directives;