// bia v0.0.0
function create_if_block(vm) {
    var p;

    return {
        c: function create() {
            p = createElement('p');

            p.textContent = 'yar';

            this.h();

            vm.$el = p;
        },
        h: function hydrate() {
            setClass(p, 'yar');
        },
        m: function mount(target) {
            appendChild(target, p);
        }
    };
}

function createElement(tag) {
    return document.createElement(tag);
}

function setClass(el, className) {
    el.className = className;
}

function appendChild(target, el) {
    return target.appendChild(el);
}
function replaceNode(target, node) {
    target.replaceWith(node);
}

function noop() {}

function create_main_fragment(vm) {
    var div, span, div_1, span_1, div_2, span_2, div_3;

    var if_block = (true) && create_if_block(vm);

    return {
        c: function create() {
            div = createElement('div');
            span = createElement('span');
            div_1 = createElement('div');
            span_1 = createElement('span');
            div_2 = createElement('div');
            span_2 = createElement('span');
            div_3 = createElement('div');

            if (if_block) if_block.c();
            span.textContent = 'foo';
            span_1.textContent = 'bar';
            span_2.textContent = 'baz';

            this.h();

            vm.$el = div;
        },
        h: function hydrate() {
            setClass(div, 'root');
            setClass(span, 'foo');
            setClass(div_1, 'foo');
            setClass(span_1, 'bar');
            setClass(div_2, 'bar');
            setClass(span_2, 'baz');
            setClass(div_3, 'baz');
        },
        m: function mount(target) {
            appendChild(target, div);
            appendChild(div, span);
            appendChild(div, div_1);
            appendChild(div_1, span_1);
            appendChild(div_1, div_2);
            appendChild(div_2, span_2);
            appendChild(div_2, div_3);
            if (if_block) if_block.m(div_3);
        }
    };
}

function NodeWithDeeplyNestedDynamicChildren(options) {
    this.$fragment = create_main_fragment(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default NodeWithDeeplyNestedDynamicChildren;