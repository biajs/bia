// bia v0.0.0
function setClass(el, className) {
    el.className = className;
}

function setStyle(el, name, value) {
    el.style.setProperty(name, value);
}

function createElement(tag) {
    return document.createElement(tag);
}

function replaceNode(target, node) {
    target.replaceWith(node);
}

function noop() {}

function createFragment2(vm, state) {
    var div;

    return {
        c: function c() {
            div = createElement('div');
            vm.$el = div;

            this.h();

            return div;
        },
        h: function h() {
            setClass(div, 'foo')

            setStyle(div, 'color', 'red');
        },
        m: function m(target) {
            replaceNode(target, div);
        }
    };
}

function NodeWithAttributes(options) {
    this.$fragment = createFragment2(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default NodeWithAttributes;