import Code from '../../../generators/code';
import Fragment from '../../../generators/fragment';
import { ParsedNode } from '../../../interfaces';

export default {

    //
    // define a child fragment
    //
    childFragment() {
        console.log('ELEMENT: child frag');
        // return new Fragment(source, 'some_child_fragment');
    },

    //
    // process the current node
    //
    process() {
        console.log('ELEMENT: process');
    },

    //
    // post-process the current node
    //
    postProcess() {
        console.log('ELEMENT: post process');
    },
}