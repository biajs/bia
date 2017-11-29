// bia v0.0.0
function createElement(tag) {
    return document.createElement(tag);
}

function setClass(el, className) {
    el.className = className;
}

function replaceNode(target, node) {
    target.replaceWith(node);
}

function noop() {}

function fragment15(vm) {
    var root, div, text, if_block, text_0;

    return {
        c: function create() {
            root = createElement('div');
            div = createElement('div');
            div.textContent = 'static';
            if_block = createElement('div');
            if_block.textContent = 'dynamic';
            this.h();
            vm.$el = root;
        },
        h: function hydrate() {
            setClass(div, 'static')
        },
        m: function mount(target) {
            replaceNode(target, root);
            root.appendChild(div);

            root.appendChild(if_block);
        }
    };
}

function DynamicChildren(options) {
    this.$fragment = fragment15(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default DynamicChildren;