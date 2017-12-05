// bia v0.0.0
function setHtml(el, html) {
    el.innerHTML = html;
}

function createElement(tag) {
    return document.createElement(tag);
}

function noop() {}

function create_main_fragment(vm) {
    let div;

    return {
        c: function create() {
            div = createElement('div');
            setHtml(div, '');
            
            vm.$el = div;
        },
        d: noop,
        h: noop,
        m: noop,
        p: noop,
        u: noop
    };
}

function NodeWithDirective(options) {
    this.$fragment = create_main_fragment(this);
    
    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default NodeWithDirective;