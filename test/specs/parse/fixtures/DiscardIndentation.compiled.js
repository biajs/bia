// bia v0.0.0
function createElement(tag) {
    return document.createElement(tag);
}

function replaceNode(target, node) {
    target.replaceWith(node);
}

function noop() {}

function fragment12(vm, state) {
    var div;

    return {
        c: function c() {
            div = createElement('div');
            div.innerHTML = '\r\n        <span>hello</span>\r\n    ';
            vm.$el = div;
        },
        h: noop,
        m: function m(target) {
            replaceNode(target, div);
        }
    };
}

function DiscardIndentation(options) {
    this.$fragment = fragment12(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default DiscardIndentation;