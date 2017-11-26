import { JsCode } from '../classes/index';
import defineExport from './define_export';
import defineGlobalFunctions from './global_functions';
import defineRootConstructor from './root_constructor';

// @todo: read this value from package.json
const version = '0.0.0';

export default function(parsedSource, options) {
    const code = new JsCode({
        content: [
            defineGlobalFunctions(),
            null,
            defineRootConstructor(parsedSource, options),
            null,
            defineExport(options),
        ],
        root: true,
    });

    return `// bia v${version}\n${code}`;
}