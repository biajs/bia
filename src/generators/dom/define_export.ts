import { 
    JsIf,
    JsCode,
    JsFunction,
    JsObject,
    JsVariable,
} from '../classes/index';

export default function(options) {
    const format = options.format || 'es';

    // ecmascript export
    if (format === 'es') {
        return new JsCode({
            content: [
                `export default ${options.name};`,
            ],
        });
    }

    // function
    if (format === 'fn') {
        return new JsCode({
            content: [
                `return ${options.name};`,
            ],
        });
    }
}