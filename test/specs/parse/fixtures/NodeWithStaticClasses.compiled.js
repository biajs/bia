// bia v0.0.0
function createElement(tag) {
    return document.createElement(tag);
}

function setClass(el, className) {
    el.className = className;
}

function appendChild(target, el) {
    return target.appendChild(el);
}
function replaceNode(target, node) {
    target.replaceWith(node);
}

function noop() {}

function create_main_fragment(vm) {
    var div;

    return {
        c: function create() {
            div = createElement('div');

            div.innerHTML = '';

            this.h();

            vm.$el = div;
        },
        h: function hydrate() {
            setClass(div, 'foo bar');
        },
        m: function mount(target) {
            appendChild(target, div);
        }
    };
}

function NodeWithStaticClasses(options) {
    this.$fragment = create_main_fragment(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default NodeWithStaticClasses;