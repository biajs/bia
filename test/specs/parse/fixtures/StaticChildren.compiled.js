// bia v0.0.0
function createElement(tag) {
    return document.createElement(tag);
}

function replaceNode(target, node) {
    target.replaceWith(node);
}

function noop() {}

function fragment25(vm, state) {
    var root, div_0, div_1, text_0;

    return {
        c: function create() {
            root = createElement('div');
            root.innerHTML = '\r\n        <div>\r\n            <div>foo</div>\r\n        </div>\r\n    ';
            vm.$el = root;
        },
        h: noop,
        m: function mount(target) {
            replaceNode(target, root);
        }
    };
}

function StaticChildren(options) {
    this.$fragment = fragment25(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default StaticChildren;