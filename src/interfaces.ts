import { JsFunction } from './generators/code/index';
import { JsFragment } from './generators/dom/fragment/JsFragment';

export interface CompileOptions {
    filename: string;
    format: 'es' | 'fn';
    name: string;
};

// processor to inject dom related code
export interface DomProcessor {
    defineFragment?: Function,
    process?: Function,
    postProcess?: Function,
}

// lifecycle methods of a dom fragment
export interface FragmentLifecycle {
    constructor: JsFunction,
    create: JsFunction,
    destroy: JsFunction,
    mount: JsFunction,
    unmount: JsFunction,
    update: JsFunction,
}

// object used to identify fragments and parsed nodes
export interface JsFragmentNode {
    fragment: JsFragment,
    node: ParsedNode,
}

// directive object parsed from dom element
// b-whatever.foo.bar:baz="yar"
export interface NodeDirective {
    arg: string | null;         // 'baz'
    expression: string;         // 'yar'
    isProcessed: boolean;       // determins if the node has been processed
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

// a parsed .bia file
export interface ParsedSource {
    template: ParsedNode;
}

export interface TextInterpolation {
    expression: string;
    text: string;
};