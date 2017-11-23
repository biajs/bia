type CodeOptions = {
    content?: Array<any>;
    id?: null | string;
}

export class Code {
    public content: Array<Code|string>;
    public id: string;
    public options: CodeOptions;

    constructor(options: CodeOptions) {
        this.content = options.content || [];
        this.id = options.id || null;
        this.options = options;
    }
}