import { compile, expect, render } from '../../utils';

describe('text interpolation', () => {
    it('basic concatenation', function() {
        const source = `
            <template>
                <div>Hello {{ name }}</div>
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
        expect(vm.$el.textContent).to.equal('Hello Bob');
    
        vm.name = 'Jill';
        // vm.$nextTick(() => {
        //     expect(vm.$el.outerHTML).to.equal('Hello Jill');
        //     done();
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

    it.skip('ternary expressions', () => {
        const source = `
            <template>
                <div>The switch is {{ switch ? 'on' : 'off' }}</div>
            </template>
        `;

        const options = {
            data: {
                switch: false,
            },
        };

        const output = compile(source, options);
        console.log(output);

        // const vm = render(source, options);
        // expect(vm.$el.textContent).to.equal('hello');
    })
});