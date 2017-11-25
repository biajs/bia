import { 
    JsCode,
    JsFunction,
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
                content: [
                    // define this component's fragment
                    `this.$fragment = ${createFragmentFn}(this);`,
                ],
            }),
        ],
    });
};

