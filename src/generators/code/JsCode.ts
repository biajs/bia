import { JsScript } from './JsScript';

//
// Options
//
export interface JsCodeOptions {
    content?: Array<JsCode|string>;
    id?: string | null;
    script?: JsScript | null;
}

//
// JsCode
//
export class JsCode {
    public content: Array<JsCode|string>
    public id: string | null;
    public script: JsScript | null;

    /**
     * Constructor.
     */
    constructor(options: JsCodeOptions = {}) {
        this.content = options.content || [];
        this.id = options.id || null;
        this.script = options.script || null;
    }
}