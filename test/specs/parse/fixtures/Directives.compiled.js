// bia v0.0.0
function createElement(tag) {
    return document.createElement(tag);
}

function replaceNode(target, node) {
    target.replaceWith(node);
}

function noop() {}

function createFragment10(vm, state) {
    var div;

    return {
        c: function c() {
            div = createElement('div');
            vm.$el = div;

            div.innerHTML = '\r\n        <span>0</span>\r\n        <span b-name=\"\">1</span>\r\n        <span b-name.one=\"\">2</span>\r\n        <span b-name.one.two=\"\">3</span>\r\n        <span b-name:arg=\"\">4</span>\r\n        <span b-name.one:arg=\"\">5</span>\r\n        <span b-name.one.two:arg=\"\">6</span>\r\n        <span b-name=\"expression\">7</span>\r\n        <span b-name.one=\"expression\">8</span>\r\n        <span b-name.one.two=\"expression\">9</span>\r\n        <span b-name:arg=\"expression\">10</span>\r\n        <span b-name.one:arg=\"expression\">11</span>\r\n        <span b-name.one.two:arg=\"expression\">12</span>\r\n        <span b-foo=\"\" b-bar=\"\">13</span>\r\n    ';

            return div;
        },
        h: noop,
        m: function m(target) {
            replaceNode(target, div);
        }
    };
}

function Directives(options) {
    this.$fragment = createFragment10(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default Directives;