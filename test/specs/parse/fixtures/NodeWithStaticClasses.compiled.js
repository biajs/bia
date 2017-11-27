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

function fragment18(vm, state) {
    var div;

    return {
        c: function c() {
            div = createElement('div');
            div.innerHTML = '';
            this.h();
            vm.$el = div;
        },
        h: function h() {
            setClass(div, 'foo bar')
        },
        m: function m(target) {
            replaceNode(target, div);
        }
    };
}

function NodeWithStaticClasses(options) {
    this.$fragment = fragment18(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default NodeWithStaticClasses;