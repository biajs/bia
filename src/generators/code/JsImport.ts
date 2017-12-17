import { BaseCode, BaseCodeOptions } from './BaseCode';

//
// Options
//
export interface JsImportOptions extends BaseCodeOptions {
    name?: string;
    path: string;
    destructure?: Array<string>;
}

//
// JsImport
//
export class JsImport extends BaseCode {
    public destructure: Array<string>;
    public name: string | null;
    public path: string;

    /**
     * Constructor.
     * 
     * @param {JsImportOptions} options
     */
    constructor(options: JsImportOptions) {
        super(options);

        this.destructure = options.destructure;
        this.name = options.name || null;
        this.path = options.path;

        this.validateIds();
    }
    
    /**
     * Get class name.
     * 
     * @return {string}
     */
    public getClassName(): string {
        return 'JsImport';
    }

    /**
     * Get descendent code.
     * 
     * @return {Array<BaseCode>}
     */
    getDescendents(): Array<BaseCode> {
        // import statements have no descendent code
        return [];
    }

    /**
     * Convert to a string.
     * 
     * @return {string}
     */
    toString(): string {
        // default import
        if (typeof this.name === 'string') {
            return `import ${this.name} from '${this.path}';`;
        }

        // destructured import
        if (this.destructure.length > 0) {
            return `import { ${this.destructure.join(', ')} } from '${this.path}';`;
        }
        
        // @todo: allow for named destructuring, ex: import { foo as bar } from 'place';
    }
}