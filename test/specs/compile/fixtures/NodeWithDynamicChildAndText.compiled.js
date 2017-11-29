// bia v0.0.0
function createElement(tag) {
    return document.createElement(tag);
}

function createText(text) {
    return document.createTextNode(text);
}

function replaceNode(target, node) {
    target.replaceWith(node);
}

function noop() {}

function fragment6(vm) {
    var root, text, if_block, text_0;

    return {
        c: function create() {
            root = createElement('div');
            text = createText('\r\n        foo\r\n        ');
            if_block = createElement('span');
            if_block.textContent = 'bar';
            this.h();
            vm.$el = root;
        },
        h: function hydrate() {

        },
        m: function mount(target) {
            replaceNode(target, root);
            root.appendChild(text);

            root.appendChild(if_block);
        }
    };
}

function NodeWithDynamicChildAndText(options) {
    this.$fragment = fragment6(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default NodeWithDynamicChildAndText;