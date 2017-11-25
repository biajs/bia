import { 
    JsCode,
    JsFunction,
    JsIf,
} from '../classes/index';

import createFragment from './create_fragment';
import uniqueId from '../../utils/unique_id';

export default function(parsedSource, options) {
    const createFragmentFn = uniqueId('createFragment');

    return new JsCode({
        content: [
            // define our fragment constructor
            createFragment(createFragmentFn, parsedSource.template),
            null,
            
            new JsFunction({
                id: 'rootFn',
                name: options.name,
                signature: ['options'],
                content: [
                    // define this component's fragment
                    `this._fragment = ${createFragmentFn}(this);`,
                    null,
                    mountIfStatement(),
                ],
            }),
        ],
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
            `this._el = this._fragment.c();`, // <- create the component instance
            `this._fragment.m(options.el);`, // <- mount it to our target el
        ],
    });
}
