const pkg = require('../../../package.json');

import { JsCode } from '../classes';
import defineGlobalFunctions from './global_functions';
import defineRootConstructor from './root_constructor';

export default function(parsedSource, options) {
    const code = new JsCode({
        content: [
            `// bia v${pkg.version}`,
            null,
            defineGlobalFunctions(),
            null,
            defineRootConstructor(parsedSource, options),
        ],
    });

    return String(code);
}