import { compile, expect, render } from '../../utils';

describe('text interpolation', () => {
    it('basic concatenation', function(done) {
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

        vm.$nextTick(() => {
            expect(vm.$el.textContent).to.equal('Hello Jill');
            done();
        });
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

    it('nested state', (done) => {
        const source = `
            <template>
                <div>{{ foo.bar }}</div>
            </template>
        `;
    
        const options = {
            data: {
                foo: {
                    bar: 'One day, at band camp...',
                }
            },
        };
    
        // const output = compile(source, options);
        // console.log(output);
    
        const vm = render(source, options);
        expect(vm.$el.textContent).to.equal('One day, at band camp...');

        vm.foo.bar = 'A bear came.';

        vm.$nextTick(() => {
            expect(vm.$el.textContent).to.equal('A bear came.');
            done();
        });
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

    it('ternary expressions', (done) => {
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

        vm.foo = false;

        vm.$nextTick(() => {
            expect(vm.$el.textContent).to.equal('baz');
            done();
        });
    });

    it('computed object properties', (done) => {
        const source = `
            <template>
                <div>{{ foo[bar] }}</div>
            </template>
        `;

        const options = {
            data: {
                foo: {
                    hello: 'Hello',
                    world: 'World',
                },
                bar: 'hello',
            },
        };

        // const output = compile(source, options);
        // console.log(output);

        const vm = render(source, options);
        expect(vm.$el.textContent).to.equal('Hello');

        vm.bar = 'world';

        vm.$nextTick(() => {
            expect(vm.$el.textContent).to.equal('World');
            
            vm.foo = { hello: 'one', world: 'two' };

            vm.$nextTick(() => {
                expect(vm.$el.textContent).to.equal('two');
                done();
            });
        });
    });

    it('square bracket object props', (done) => {
        const source = `
            <template>
                <div>{{ foo['bar'] }}</div>
            </template>
        `;

        const options = {
            data: {
                foo: {
                    bar: 'Hello',
                },
            },
        };

        // const output = compile(source, options);
        // console.log(output);

        const vm = render(source, options);
        expect(vm.$el.textContent).to.equal('Hello');

        vm.foo.bar = 'Goodbye';

        vm.$nextTick(() => {
            expect(vm.$el.textContent).to.equal('Goodbye');
            done();
        });
    })
});