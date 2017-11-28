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

function fragment6(vm, state) {
    var root, text_0, span_0, text_1;

    return {
        c: function create() {
            root = createElement('div');
            text_0 = createText('\r\n        foo\r\n        ');
            span_0 = createElement('span');
            span_0.textContent = 'bar';
            this.h();
            vm.$el = root;
        },
        h: function hydrate() {

        },
        m: function mount(target) {
            replaceNode(target, root);
            root.appendChild(text_0);

            root.appendChild(span_0);
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