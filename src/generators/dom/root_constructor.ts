import { 
    JsCode,
    JsFunction,
    JsIf,
} from '../classes/index';

import Fragment from './fragment/fragment';
import uniqueId from '../../utils/unique_id';

export default function(parsedSource, options) {

    const fragment = new Fragment(parsedSource);
    
    return new JsCode({

    });
};

/**
 * If an "el" property was provided, mount the component on instantiation.
 * 
 * @return  {JsIf}
 */
function mountIfStatement() {
    return new JsIf({
        id: 'rootFnMountIfStatement',
        condition: 'options.el',
        content: [
            `this.$fragment.c();`, // <- create the component instance
            `this.$fragment.m(options.el);`, // <- mount it to our target el
        ],
    });
}
