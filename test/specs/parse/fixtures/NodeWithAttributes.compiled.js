// bia v0.0.0
function createElement(tag) {
    return document.createElement(tag);
}

function replaceNode(target, node) {
    target.replaceWith(node);
}

function noop() {}

function fragment15(vm, state) {
    var div;

    return {
        c: function c() {
            div = createElement('div');
            div.innerHTML = '';
            this.h();
            vm.$el = div;
        },
        h: function h() {
            div.dataset.baz = 'yar'
        },
        m: function m(target) {
            replaceNode(target, div);
        }
    };
}

function NodeWithAttributes(options) {
    this.$fragment = fragment15(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default NodeWithAttributes;