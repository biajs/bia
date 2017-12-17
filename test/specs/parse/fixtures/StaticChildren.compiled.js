// bia v0.0.0
function insertNode(node, target, anchor) {
    target.insertBefore(node, anchor);
}

function setHtml(el, html) {
    el.innerHTML = html;
}

function createElement(tag) {
    return document.createElement(tag);
}

function noop() {}

function create_main_fragment(vm) {
    var div;

    return {
        c: function create() {
            div = createElement('div');
            setHtml(div, '\r\n        <div>\r\n            <div>foo</div>\r\n        </div>\r\n    ');
            
            return div;
        },
        d: noop,
        h: noop,
        m: function mount(target, anchor) {
            insertNode(div, target, anchor);
        },
        p: noop,
        u: noop
    };
}

function StaticChildren(options) {
    this.$fragment = create_main_fragment(this);
    
    if (options.el) {
        this.$el = this.$fragment.c();
        this.$fragment.m(options.el, options.anchor || null);
    }
}

export default StaticChildren;