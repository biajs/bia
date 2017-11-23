type CodeOptions = {
    content?: Array<string>;
    id?: null | string;
}

export class Code {
    public content: Array<any>;
    public id: string;
    public options: CodeOptions;

    constructor(options: CodeOptions) {
        this.content = options.content || [];
        this.id = options.id || null;
        this.options = options;
    }
}