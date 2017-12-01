// bia v0.0.0
function create_if_block(vm) {
    var span;

    return {
        c: function create() {
            span = createElement('span');

            span.textContent = 'bar';

            vm.$el = span;
        },
        h: noop,
        m: function mount(target) {
            appendChild(target, span);
        }
    };
}

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
    var div, text;

    var if_block = (true) && create_if_block(vm);

    return {
        c: function create() {
            div = createElement('div');

            if (if_block) if_block.c();

            this.h();

            vm.$el = div;
        },
        h: noop,
        m: function mount(target) {
            appendChild(target, div);
            appendChild(div, text);
            if (if_block) if_block.m(div);
        }
    };
}

function NodeWithDynamicChildAndText(options) {
    this.$fragment = create_main_fragment(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default NodeWithDynamicChildAndText;