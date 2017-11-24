import { Code, CodeOptions } from './Code';
import { indent } from '../../utils/string';

interface JsObjectOptions extends CodeOptions {
    properties?: Object;
}

export class JsObject extends Code {
    public properties: Object;

    /**
     * Constructor
     */
    constructor(options: JsObjectOptions) {
        super(options);
        this.properties = options.properties || {};
    }

    /**
     * Cast to string.
     * 
     * @return {string}
     */
    public toString() {
        const propertyNames = Object.keys(this.properties);

        // if our object is empty, return {}
        if (propertyNames.length === 0) {
            return '{}';
        }

        // otherwise stringify our object's properties
        const objectContent = propertyNames.reduce((properties, key) => {
            let propertyContent = `${key}: ${String(this.properties[key])}`;

            return properties.concat(indent(propertyContent));
        }, []);

        return `{\n${objectContent.join(',\n')}\n}`;
    }
} 