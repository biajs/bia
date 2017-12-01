export interface CompileOptions {
    filename: string;
    name: string;
};

// directive object parsed from dom element
// b-whatever.foo.bar:baz="yar"
export interface NodeDirective {
    arg: string | null;         // 'baz'
    expression: string;         // 'yar'
    modifiers: Array<string>;   // ['foo', 'bar']
    name: string;               // 'whatever'
}

export enum NodeType {
    ELEMENT = 'ELEMENT',
    TEXT = 'TEXT',
    PROCESSING_INSTRUCTION = 'PROCESSING_INSTRUCTION',
    COMMENT = 'COMMENT',
    DOCUMENT = 'DOCUMENT',
    DOCUMENT_TYPE = 'DOCUMENT_TYPE',
    DOCUMENT_FRAGMENT = 'DOCUMENT_FRAGMENT',
};

// node/variable name pairings
export interface NodeVar {
    name: string;
    node: ParsedNode;
};

// a parsed fragment of the dom
export interface ParsedNode {
    attributes: any;
    children: Array<ParsedNode>;
    dataAttributes: Object;
    directives: Array<NodeDirective>;
    hasDynamicChildren: boolean;
    innerHTML: string;
    parent: ParsedNode | null,
    staticClasses: Array<string>;
    staticStyles: Object;
    tagName: string | null;
    textContent: null | string;
    textInterpolations: Array<TextInterpolation>;
    type: NodeType;
};

export interface TextInterpolation {
    expression: string;
    text: string;
};