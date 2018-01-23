import { compile, expect, render } from '../../utils';

describe('text interpolation', () => {
    it.skip('basic concatenation', function(done) {
        const source = `
            <template>
                <div>Hello {{ name.lol }}</div>
            </template>
        `;
    
        const options = {
            data: {
                name: 'Bob',
            }
        };
    
        const output = compile(source, options);
        // console.log(output);
    
        // const vm = render(source, options);
        // expect(vm.$el.textContent).to.equal('Hello Bob');
    
        // vm.name = 'Jill';
        // vm.$nextTick(() => {
        //     console.log(vm.$el.outerHTML);
            done();
        // });
    });

    it('static vars', () => {
        const source = `
            <template>
                <div>{{ 'Hello there' }}</div>
            </template>
        `;
    
        const options = {};
    
        // const output = compile(source, options);
        // console.log(output);
    
        const vm = render(source, options);
        expect(vm.$el.textContent).to.equal('Hello there');
    });

    it('interpolated concatenation', () => {
        const source = `
            <template>
                <div>{{ 'Hello ' + name }}</div>
            </template>
        `;
    
        const options = {
            data: {
                name: 'Bob',
            },
        };
    
        // const output = compile(source, options);
        // console.log(output);
    
        const vm = render(source, options);
        expect(vm.$el.textContent).to.equal('Hello Bob');
    });

    it('function calls', function() {
        const source = `
            <template>
                <div>Hello {{ name.toUpperCase() }}</div>
            </template>
        `;
    
        const options = {
            data: {
                name: 'Bob',
            }
        };
    
        // const output = compile(source, options);
        // console.log(output);
    
        const vm = render(source, options);
        expect(vm.$el.textContent).to.equal('Hello BOB');
    });

    it('nested state', () => {
        const source = `
            <template>
                <div>{{ foo.bar }}</div>
            </template>
        `;
    
        const options = {
            data: {
                foo: {
                    bar: 'Hello from bar',
                }
            },
        };
    
        // const output = compile(source, options);
        // console.log(output);
    
        const vm = render(source, options);
        expect(vm.$el.textContent).to.equal('Hello from bar');
    });

    it('or expressions', () => {
        const source = `
            <template>
                <div>{{ greeting || 'goodbye' }}</div>
            </template>
        `;

        const options = {
            data: {
                greeting: 'hello',
            },
        };

        // const output = compile(source, options);
        // console.log(output);

        const vm = render(source, options);
        expect(vm.$el.textContent).to.equal('hello');
    });

    it('ternary expressions', () => {
        const source = `
            <template>
                <div>{{ foo ? 'bar' : 'baz' }}</div>
            </template>
        `;

        const options = {
            data: {
                foo: true,
            },
        };

        // const output = compile(source, options);
        // console.log(output);

        const vm = render(source, options);
        expect(vm.$el.textContent).to.equal('bar');
    })
});