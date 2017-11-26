// bia v0.0.0
function setClass(el, className) {
    el.className = className;
}

function createElement(tag) {
    return document.createElement(tag);
}

function replaceNode(target, node) {
    target.replaceWith(node);
}

function noop() {}

function createFragment9(vm, state) {
    var div;

    return {
        c: function c() {
            div = createElement('div');
            vm.$el = div;

            this.h();

            return div;
        },
        h: function () {
            setClass(div, '')

        },
        m: function m(target) {
            replaceNode(target, div);
        }
    };
}

function NodeWithAttributes(options) {
    this.$fragment = createFragment9(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default NodeWithAttributes;