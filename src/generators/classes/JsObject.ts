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
     * Add a property to the object.
     * 
     * @param  {string} key
     * @param  {Code}   value 
     * @return {void}
     */
    public addProperty(key: string, value): void {
        // make sure that key is not already taken
        if (this.hasProperty(key)) {
            throw `Failed to add property "${key}" to object, that key is already defined.`;
        }

        // and if it wasn't go ahead and attach our new property
        this.properties[key] = value;
    }

    /**
     * Get a property from the object.
     * 
     * @param  {string} key
     */
    public getProperty(key: string): any {
        // make sure the key is defined
        if (!this.hasProperty(key)) {
            throw `Failed to get property "${key}", that property is not defined.`;
        }

        return this.properties[key];
    }

    /**
     * Determine if an object has a particular property.
     * 
     * @param  {string} key
     * @return {boolean}
     */
    public hasProperty(key: string): boolean {
        return typeof this.properties[key] !== 'undefined';
    }

    /**
     * Remove a property from the object.
     * 
     * @param  {string} key 
     * @return {void}
     */
    public removeProperty(key: string): void {
        // make sure the key is defined
        if (!this.hasProperty(key)) {
            throw `Failed to remove property "${key}" from object, that key is not defined.`;
        }

        delete this.properties[key];
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