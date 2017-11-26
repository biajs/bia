export interface CompileOptions {
    filename: 'string';
    name: 'string';
};

export enum NodeType {
    ELEMENT = 'ELEMENT',
    TEXT = 'TEXT',
    PROCESSING_INSTRUCTION = 'PROCESSING_INSTRUCTION',
    COMMENT = 'COMMENT',
    DOCUMENT = 'DOCUMENT',
    DOCUMENT_TYPE = 'DOCUMENT_TYPE',
    DOCUMENT_FRAGMENT = 'DOCUMENT_FRAGMENT',
};

export interface ParsedNode {
    attributes: any;
    children: Array<any>;
    innerHTML: string;
    staticClasses: Array<string>;
    staticStyles: Object;
    tagName: string | null;
    textContent: null | string;
    type: NodeType;
};