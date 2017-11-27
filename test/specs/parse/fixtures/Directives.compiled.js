// bia v0.0.0
function createElement(tag) {
    return document.createElement(tag);
}

function replaceNode(target, node) {
    target.replaceWith(node);
}

function noop() {}

function fragment11(vm, state) {
    var div;

    return {
        c: function c() {
            div = createElement('div');
            span_1 = createElement('span');
            span_2 = createElement('span');
            span_3 = createElement('span');
            span_4 = createElement('span');
            span_5 = createElement('span');
            span_6 = createElement('span');
            span_7 = createElement('span');
            span_8 = createElement('span');
            span_9 = createElement('span');
            span_10 = createElement('span');
            span_11 = createElement('span');
            span_12 = createElement('span');
            span_13 = createElement('span');
            span_14 = createElement('span');
            vm.$el = div;
        },
        h: noop,
        m: function m(target) {
            replaceNode(target, div);
        }
    };
}

function Directives(options) {
    this.$fragment = fragment11(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default Directives;