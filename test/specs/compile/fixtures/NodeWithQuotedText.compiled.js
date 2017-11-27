// bia v0.0.0
function createElement(tag) {
    return document.createElement(tag);
}

function replaceNode(target, node) {
    target.replaceWith(node);
}

function noop() {}

function fragment7(vm, state) {
    var div;

    return {
        c: function c() {
            div = createElement('div');
            div.textContent = 'Foo\'s \"bar\"';
            vm.$el = div;
        },
        h: noop,
        m: function m(target) {
            replaceNode(target, div);
        }
    };
}

function NodeWithQuotedText(options) {
    this.$fragment = fragment7(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default NodeWithQuotedText;