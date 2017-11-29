import { ParsedNode } from '../interfaces';
import { isElementNode, isTextNode } from './parsed_node';

interface NamedNode {
    name: string;
    node: ParsedNode;
};

export class VariableNamer {
    public namedNodes: Array<NamedNode>;
    public prefixCounter: Object;

    constructor() {
        this.namedNodes = [];
        this.prefixCounter = {};
    }

    public getName(node: ParsedNode, prefix: string = null) {
        
        // if we've already named this node, return it
        const namedNode = this.namedNodes.find(n => n.node === node);

        if (namedNode) {
            return namedNode.name;
        }

        // set our prefix if none was provided
        if (!prefix && isElementNode(node)) {
            prefix = node.tagName.toLowerCase();
        } else if (!prefix && isTextNode(node)) {
            prefix = 'text';
        }

        // if we've never used this prefix before, add it to the counter
        if (typeof this.prefixCounter[prefix] === 'undefined') {
            this.prefixCounter[prefix] = 0;

            this.namedNodes.push({ name: prefix, node });

            return prefix;
        } 
            
        // otherwise increment the count
        else {
            const name = `${prefix}_${this.prefixCounter[prefix]++}`;

            this.namedNodes.push({ name, node });

            return name;
        }
    }
}