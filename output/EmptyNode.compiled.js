// bia v0.0.0

function createElement(tag) {
    return document.createElement(tag);
}

function insertNode(node, target) {
    target.insertBefore(node);
}

function noop() {}

function createFragment0(vm, state) {
    var div;
    
    return {
        c: function c() {
            div = createElement('div');
        },
        m: function m(target) {
            insertNode(div, target);
        }
    };
}

function EmptyNode() {
    this.$fragment = createFragment0(this);
}

module.exports = EmptyNode;