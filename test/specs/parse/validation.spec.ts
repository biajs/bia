import { parse } from '../../../src/parse/parse';
const { expect } = require('chai');
const path = require('path');
const fs = require('fs');

describe('validation', () => {

    // helper function to parse a fixture
    const parseFixture = (name, options) => {
        const source = fs.readFileSync(path.resolve(__dirname, 'fixtures', name + '.bia'), 'utf8');

        return parse(source, {
            filename: name + '.bia',
            name: name,
            ...options,
        });
    }

    //
    // options
    //
    describe('options', () => {
        // @todo: add tests that use invalid config objects. 
        //        need to disable typescript to do this.
    });

    //
    // template
    //
    describe('template', () => {
        const opts = {
            filaname: 'Options.bia',
            name: 'OptionsStub',
        };

        it('throws an error if no template is defined', () => {
            expect(() => parseFixture('NoTemplate', opts)).to.throw(
                'Failed to parse NoTemplate.bia, no template block is defined.'
            );
        });
    
        it('throws an error if multiple templates are defined', () => {
            expect(() => parseFixture('MultipleTemplates', {})).to.throw(
                `Failed to parse MultipleTemplates.bia, only one template block may be defined.`
            );
        });
    
        it('throws an error if the template has more than one root element', () => {
            expect(() => parseFixture('MultipleRootNodes', {})).to.throw(
                `Failed to parse MultipleRootNodes.bia, template must contain exactly one root element.`
            );
        });

        it('throws an error if there are non-conditional node between if and else blocks')

        it('throws an error if there are non-conditional nodes between if and else-if blocks');

        it('throws an error if there are non-conditional nodes between else-if and other else-if blocks');

        it('throws an error if there are non-conditional nodes between else-if and else blocks');

        it('throws an error if else-if blocks are not preceeded by an if or else-if block');

        it('throws an error if else blocks are not preceeded by an if or else-if block');
    });
});