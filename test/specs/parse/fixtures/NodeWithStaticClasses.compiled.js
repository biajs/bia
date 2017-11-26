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

function createFragment11(vm, state) {
    var div;
    
    return {
        c: function c() {
            div = createElement('div');
            vm.$el = div;
            
            
            this.h();
            
            return div;
        },
        h: function () {
            setClass(div, 'foo bar')
            
        },
        m: function m(target) {
            replaceNode(target, div);
        }
    };
}

function NodeWithStaticClasses(options) {
    this.$fragment = createFragment11(this);
    
    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default NodeWithStaticClasses;