describe.only('if block', () => {
    const file = require('path').resolve(__dirname, 'Component.bia');

    it('renders', () => {
        const { code } = compile(file);
        // // const vm = render(file, { el });

        // console.log (code);
    });
});