// bia v0.0.0
function createElement(tag) {
    return document.createElement(tag);
}

function replaceNode(target, node) {
    target.replaceWith(node);
}

function noop() {}

function fragment1(vm) {
    var root, if_block, text;

    return {
        c: function create() {
            root = createElement('main');
            if_block = createElement('div');
            if_block.textContent = 'bar';
            this.h();
            vm.$el = root;
        },
        h: function hydrate() {

        },
        m: function mount(target) {
            replaceNode(target, root);
            root.appendChild(if_block);
        }
    };
}

function IfBlock(options) {
    this.$fragment = fragment1(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default IfBlock;