import * as helpers from '../../../src/compilers/dom/helpers';
import Code from '../../../src/generators/code';
import Fragment from '../../../src/generators/fragment';
import { createParsedNode, expect } from '../../utils';

describe('fragment class', () => {
    let baseCode;
    let fragment;
    let node;
    
    beforeEach(() => {
        baseCode = new Code(`
            :helpers

            :fragments
        `, {
            helpers,
        });

        node = createParsedNode({
            tagName: 'div',
        });

        fragment = new Fragment(baseCode, {
            node: node,
            name: 'test_fragment',
        });

        baseCode.append(fragment, 'fragments');
    });

    it('can be cast to a string', () => {
        expect(fragment.toString()).to.equalCode(`
            function #test_fragment(vm) {
                return {
                    c: @noop,
                    h: @noop,
                    m: @noop,
                    p: @noop,
                    u: @noop,
                    d: @noop,
                };
            }
        `);
    });

    it('can append code onto lifecycle methods', () => {
        fragment.create.append('// create');
        fragment.hydrate.append('// hydrate');
        fragment.mount.append('// mount');
        fragment.update.append('// update');
        fragment.unmount.append('// unmount');
        fragment.destroy.append('// destroy');
        
        expect(fragment.toString()).to.equalCode(`
            function #test_fragment(vm) {
                return {
                    c: function create() {
                        // create
                    },
                    h: function hydrate() {
                        // hydrate
                    },
                    m: function mount(#target, #anchor) {
                        // mount
                    },
                    p: function update(#changed) {
                        // update
                    },
                    u: function unmount() {
                        // unmount
                    },
                    d: function destroy() {
                        // destroy
                    },
                };
            }
        `);
    });

    it('defines vars that don\'t collide with other vars', () => {
        let foo = {};
        let bar = {};
        let baz = {};
        let yar = {};

        baseCode.reservedIdentifiers = ['world'];

        expect(fragment.define(foo, 'hello')).to.equal('hello');
        expect(fragment.define(bar, 'hello')).to.equal('hello_1');
        expect(fragment.define(baz, 'world')).to.equal('world_1');
        expect(fragment.define(yar, 'world')).to.equal('world_2');        
    });

    it('includes defined variables in the constructor', () => {
        const foo = {};
        const bar = {};

        fragment.define(foo, 'div');
        fragment.define(bar, 'div');

        expect(fragment.toString()).to.equalCode(`
            function #test_fragment(vm) {
                var div, div_1;

                return {
                    c: @noop,
                    h: @noop,
                    m: @noop,
                    p: @noop,
                    u: @noop,
                    d: @noop,
                };
            }
        `);
    });

    it('can append code into the constructor', () => {
        fragment.content.append('// hello world');
        
        expect(fragment.toString()).to.equalCode(`
            function #test_fragment(vm) {
                // hello world

                return {
                    c: @noop,
                    h: @noop,
                    m: @noop,
                    p: @noop,
                    u: @noop,
                    d: @noop,
                };
            }
        `);
    });

    it('defines variables before executing constructor content', () => {
        fragment.define({}, 'foo');
        fragment.content.append('// hello world');

        expect(fragment.toString()).to.equalCode(`
            function #test_fragment(vm) {
                var foo;

                // hello world

                return {
                    c: @noop,
                    h: @noop,
                    m: @noop,
                    p: @noop,
                    u: @noop,
                    d: @noop,
                };
            }
        `);
    });

    it('adds line breaks between constructor content', () => {
        fragment.content.append(`// foo`);

        fragment.content.append(`// bar`);

        expect(fragment.toString()).to.equalCode(`
            function #test_fragment(vm) {
                // foo

                // bar

                return {
                    c: @noop,
                    h: @noop,
                    m: @noop,
                    p: @noop,
                    u: @noop,
                    d: @noop,
                };
            }
        `);
    });
});