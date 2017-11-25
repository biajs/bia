import { JsCode } from '../classes/index';
import defineGlobalFunctions from './global_functions';
import defineRootConstructor from './root_constructor';

// @todo: read this value from package.json
const version = '0.0.0';

export default function(parsedSource, options) {
    const code = new JsCode({
        content: [
            `// bia v${version}`,
            null,
            defineGlobalFunctions(),
            null,
            defineRootConstructor(parsedSource, options),
        ],
    });

    return String(code);
}