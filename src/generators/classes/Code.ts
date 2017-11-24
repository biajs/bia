type CodeOptions = {
    content?: Array<any>;
    id?: null | string;
}

type DescendentCode = {
    code: Code;
    parent: Code;
}

export class Code {
    public content: Array<Code|string>;
    public id: string;
    public options: CodeOptions;

    constructor(options: CodeOptions) {
        this.content = options.content || [];
        this.id = options.id || null;
        this.options = options;

        this.validateId();
    }

    /**
     * Create an array of all descendent code instances.
     * 
     * @return {Array<Code>}
     */
    public getDescendents(): Array<DescendentCode> {
        return this.content.reduce((descendents, code) => {
            if (typeof code !== 'string') {
                descendents.push({ parent: this, code });
                descendents = descendents.concat(code.getDescendents());
            }

            return descendents;
        }, []);
    }

    /**
     * Get the ids of all descendent code instances.
     * 
     * @return {Array<string>}
     */
    public getDescendentIds(): Array<string> {
        return this.getDescendents()
            .map(descendent => descendent.code.id)
            .filter(id => id !== null);
    }

    /**
     * Validate that this code instances id is unique.
     */
    public validateId() {
        if (this.id && this.getDescendentIds().includes(this.id)) {
            throw `Invalid code structure, duplicate id "${this.id}" defined.`;
        }
    }
}