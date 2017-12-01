// bia v0.0.0
function create_if_block(vm) {
    var div;

    return {
        c: function create() {
            div = createElement('div');

            div.textContent = 'bar';

            vm.$el = div;
        },
        h: noop,
        m: function mount(target) {
            appendChild(target, div);
        }
    };
}

function createElement(tag) {
    return document.createElement(tag);
}

function appendChild(target, el) {
    return target.appendChild(el);
}
function replaceNode(target, node) {
    target.replaceWith(node);
}

function noop() {}

function create_main_fragment(vm) {
    var main;

    var if_block = (foo) && create_if_block(vm);

    return {
        c: function create() {
            main = createElement('main');

            if (if_block) if_block.c();

            this.h();

            vm.$el = main;
        },
        h: noop,
        m: function mount(target) {
            appendChild(target, main);
            if (if_block) if_block.m(main);
        }
    };
}

function IfBlock(options) {
    this.$fragment = create_main_fragment(this);

    if (options.el) {
        this.$fragment.c();
        this.$fragment.m(options.el);
    }
}

export default IfBlock;