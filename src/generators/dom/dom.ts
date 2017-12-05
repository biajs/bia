import Fragment from './fragment/fragment';
import { JsCode } from '../code/index';
import { ParsedSource } from '../../interfaces';

// @todo: read this value from package.json
const version = '0.0.0';

export default function(source: ParsedSource, options) {
    const code = new JsCode({ id: 'root' });

    // stick the compiler version at the top of the file
    code.append(`// bia v${version}`);

    // create our main fragment
    const fragment = new Fragment({
        name: 'create_main_fragment',
        node: source.template,
    });

    code.append(fragment);

    // build the dom fragment and return the source code
    fragment.build();

    return String(code);
}