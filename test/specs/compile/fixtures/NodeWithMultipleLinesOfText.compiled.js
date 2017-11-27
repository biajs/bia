// bia v0.0.0
function createElement(tag) {
    return document.createElement(tag);
}

function replaceNode(target, node) {
    target.replaceWith(node);
}

function noop() {}

function fragment5(vm, state) {
    var div;

    return {
        c: function c() {
            div = createElement('div');
            vm.$el = div;
            div.textContent = '\r\n        Hello world\r\n        foo bar baz\r\n    ';

            return div;
        },
        h: noop,
        m: function m(target) {
            replaceNode(target, div);
        }
    };
}

function NodeWithMultipleLinesOfText(options) {
    this.$fragment = fragment5(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default NodeWithMultipleLinesOfText;