// bia v0.0.0
function createElement(tag) {
    return document.createElement(tag);
}

function replaceNode(target, node) {
    target.replaceWith(node);
}

function noop() {}

function fragment4(vm, state) {
    var root;

    return {
        c: function create() {
            root = createElement('div');
            this.h();
            vm.$el = root;
        },
        h: function hydrate() {
            root.dataset.foo = 'bar'
            root.dataset.oneTwo = 'three'
        },
        m: function mount(target) {
            replaceNode(target, root);
        }
    };
}

function NodeWithDataAttributes(options) {
    this.$fragment = fragment4(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default NodeWithDataAttributes;