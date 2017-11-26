// bia v0.0.0
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

function createFragment14(vm, state) {
    var div;

    return {
        c: function c() {
            div = createElement('div');
            vm.$el = div;

            this.h();

            return div;
        },
        h: function h() {
            setStyle(div, 'color', 'red');
            setStyle(div, 'font-size', '20px');
        },
        m: function m(target) {
            replaceNode(target, div);
        }
    };
}

function NodeWithStaticStyles(options) {
    this.$fragment = createFragment14(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default NodeWithStaticStyles;