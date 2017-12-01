// bia v0.0.0
function create_if_block(vm) {
    var div;

    return {
        c: function create() {
            div = createElement('div');

            div.textContent = 'dynamic';

            vm.$el = div;
        },
        h: noop,
        m: function mount(target) {
            appendChild(target, div);
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
    var div, div_1;

    var if_block = (dynamic) && create_if_block(vm);

    return {
        c: function create() {
            div = createElement('div');
            div_1 = createElement('div');

            if (if_block) if_block.c();
            div_1.textContent = 'static';

            this.h();

            vm.$el = div;
        },
        h: function hydrate() {
            setClass(div_1, 'static');
        },
        m: function mount(target) {
            appendChild(target, div);
            appendChild(div, div_1);
            if (if_block) if_block.m(div);
        }
    };
}

function DynamicChildren(options) {
    this.$fragment = create_main_fragment(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default DynamicChildren;