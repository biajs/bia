// bia v0.0.0
function createElement(tag) {
    return document.createElement(tag);
}

function replaceNode(target, node) {
    target.replaceWith(node);
}

function noop() {}

function fragment1(vm, state) {
    var root, div_0;

    return {
        c: function create() {
            root = createElement('main');
            div_0 = createElement('div');
            div_0.textContent = 'bar';
            this.h();
            vm.$el = root;
        },
        h: function hydrate() {

        },
        m: function mount(target) {
            replaceNode(target, root);
            root.appendChild(div_0);
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