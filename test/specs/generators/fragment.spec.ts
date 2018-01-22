import * as helpers from '../../../src/compilers/dom/helpers';
import Code from '../../../src/generators/code';
import Fragment from '../../../src/generators/fragment';
import { expect } from '../../utils';

describe('fragment class', () => {
    let baseCode;
    let fragment;
    
    beforeEach(() => {
        baseCode = new Code(`
            :helpers

            :fragments
        `, {
            helpers,
        });

        fragment = new Fragment(baseCode, 'test_fragment');

        baseCode.append(fragment, 'fragments');
    });

    it('can be cast to a string', () => {
        expect(fragment.toString()).to.equalCode(`
            function test_fragment(vm) {
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

    it('can push code onto lifecycle methods', () => {
        fragment.create.push('// create');
        fragment.hydrate.push('// hydrate');
        fragment.mount.push('// mount');
        fragment.update.push('// update');
        fragment.unmount.push('// unmount');
        fragment.destroy.push('// destroy');
        
        expect(fragment.toString()).to.equalCode(`
            function test_fragment(vm) {
                return {
                    c: function create() {
                        // create
                    },
                    h: function hydrate() {
                        // hydrate
                    },
                    m: function mount(target, anchor) {
                        // mount
                    },
                    p: function update(changed) {
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

        expect(fragment.getVarName(foo, 'hello')).to.equal('hello');
        expect(fragment.getVarName(bar, 'hello')).to.equal('hello_1');
        expect(fragment.getVarName(baz, 'world')).to.equal('world_1');
        expect(fragment.getVarName(yar, 'world')).to.equal('world_2');        
    });

    it('includes defined variables in the constructor', () => {
        const foo = {};
        const bar = {};

        fragment.getVarName(foo, 'div');
        fragment.getVarName(bar, 'div');

        expect(fragment.toString()).to.equalCode(`
            function test_fragment(vm) {
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

    it('can push code into the constructor', () => {
        fragment.content.push('// hello world');
        
        expect(fragment.toString()).to.equalCode(`
            function test_fragment(vm) {
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
        fragment.getVarName({}, 'foo');
        fragment.content.push('// hello world');

        expect(fragment.toString()).to.equalCode(`
            function test_fragment(vm) {
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
        baseCode.reservedIdentifiers.push('createComment');

        fragment.content.push(`// foo`);

        fragment.content.push(`// bar`);

        expect(fragment.toString()).to.equalCode(`
            function test_fragment(vm) {
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

    it.skip('whatever', () => {
        fragment.getVarName({}, 'foo');

        fragment.content.push(`
            // hello rachael!!!!!
        `);

        console.log(baseCode.toString());
    })
});