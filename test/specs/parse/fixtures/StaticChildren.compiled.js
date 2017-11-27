// bia v0.0.0
function createElement(tag) {
    return document.createElement(tag);
}

function replaceNode(target, node) {
    target.replaceWith(node);
}

function noop() {}

function fragment22(vm, state) {
    var div;

    return {
        c: function c() {
            div = createElement('div');
            div.innerHTML = '\r\n        <div>\r\n            <div>foo</div>\r\n        </div>\r\n    ';

            vm.$el = div;
        },
        h: noop,
        m: function m(target) {
            replaceNode(target, div);
        }
    };
}

function StaticChildren(options) {
    this.$fragment = fragment22(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default StaticChildren;