import { ParsedNode } from '../../../interfaces';
import { getDirective, nodeHasDirective, removeProcessedDirective } from '../../../utils/parsed_node';
import { JsCode, JsFunction, JsObject, JsReturn, JsVariable } from '../../classes/index';
import CreateFn from './create';
import HydrateFn from './hydrate';
import MountFn from './mount';

//
// interfaces
//
interface FragmentOptions {
    name: string,
    parent?: Fragment,
}

interface NamedNode {
    name: string,
    node: ParsedNode,
}

//
// fragment
//
class Fragment {
    public nameCounter: Object;
    public namedFragments: Array<NamedNode>;
    public namedNodes: Array<NamedNode>;
    public node: ParsedNode;
    public options: FragmentOptions;
    public parent: Fragment | null;

    /**
     * Constructor.
     */
    constructor(parsedSource, options: FragmentOptions) {
        this.nameCounter = {};
        this.namedFragments = [];
        this.namedNodes = [];
        this.node = parsedSource.template;
        this.options = options;
        this.parent = options.parent || null;
    }

    /**
     * Define our fragment's if blocks.
     * 
     * @return {JsCode}
     */
    public defineIfBlocks(): JsCode {
        const content = [];
        const globalFunctions = [];

        this.getIfNodes().forEach(node => {
            const ifDirective = getDirective(node, 'if');
            const varName = this.getChildFragmentName(node);
            const fragmentName = `create_${varName}`;

            // define each of our if blocks locally
            content.push(`var ${varName} = (${ifDirective.expression}) && ${fragmentName}(vm);`);

            // and create a new fragment for each one
            const fragmentSource = {
                template: removeProcessedDirective(node, ifDirective),
            }

            const fragment = new Fragment(fragmentSource, {
                name: fragmentName,
                parent: this,
            });

            globalFunctions.push(fragment.toCode());
        });

        // and create the child fragments as global functions

        return new JsCode({
            content,
            globalFunctions,
        });
    }

    /**
     * Define a javascript variable for each node this fragment manages.
     * 
     * @return {JsVariable}
     */
    public getElementVariables() {
        return new JsVariable({
            define: this.getChildNodes().map(node => this.getName(node)),
        });
    }

    /**
     * Get the name of a child fragment.
     * 
     * @param  {ParsedNode} node
     * @return {string} 
     */
    public getChildFragmentName(node: ParsedNode): string {
        // if we aren't the root fragment, defer to our parent
        if (this.parent) {
            return this.parent.getChildFragmentName(node);
        }

        // check if we've already named this fragment
        const namedFragment = this.namedFragments.find(namedNode => namedNode.node === node);

        if (namedFragment) {
            return namedFragment.name;
        }

        // and if not, assign it a unique name
        let varName = 'fragment';
        
        if (nodeHasDirective(node, 'if')) {
            varName = 'if_block';
        }

        // if we've never named this fragment type before, use the varName
        if (typeof this.nameCounter[varName] === 'undefined') {
            this.nameCounter[varName] = 0;
            this.namedFragments.push({ name: varName, node });

            return varName;
        }

        // otherwise add an identifier to the varName and use that
        const numberedVarName = `${varName}_${++this.nameCounter[varName]}`;
        this.namedFragments.push({ name: numberedVarName, node });
        
        return numberedVarName;
    }

    /**
     * Find the nodes with if directives on them owned by this fragment.
     * 
     * @return {Array<ParsedNode>}
     */
    public getIfNodes() {
        const getIfNodes = (ifNodes: Array<ParsedNode>, node: ParsedNode) => {
            node.children.forEach(child => {
                if (nodeHasDirective(child, 'if')) {
                    ifNodes.push(child);
                } else {
                    ifNodes.push(...getIfNodes([], child));
                }
            });

            return ifNodes;
        }

        return getIfNodes([], this.node);
    }

    /**
     * Get the variable name of a node.
     * 
     * @param  {ParsedNode} node
     * @return {string}
     */
    public getName(node: ParsedNode): string {
        // check if we've already named this node
        const alreadyNamed = this.namedNodes.find(namedNode => namedNode.node === node);

        if (alreadyNamed) {
            return alreadyNamed.name;
        }

        // and if not, assign it a unique name
        let varName = 'unknown';

        if (node.type === 'ELEMENT') {
            varName = node.tagName.toLowerCase();
        } else {
            varName = node.type.toLowerCase();
        }

        // if we've never named this node type before, use the varName
        if (typeof this.nameCounter[varName] === 'undefined') {
            this.nameCounter[varName] = 0;
            this.namedNodes.push({ name: varName, node });

            return varName;
        }

        // otherwise add an identifier to the varName and use that
        const numberedVarName = `${varName}_${++this.nameCounter[varName]}`;
        this.namedNodes.push({ name: numberedVarName, node });
        
        return numberedVarName;
    }

    /**
     * Determine which descendent nodes belong to this fragment.
     */
    public getChildNodes() {
        const getChildNodes = (childNodes, node: ParsedNode) => {
            if (!nodeHasDirective(node, 'if')) {
                childNodes.push(node);

                if (node.hasDynamicChildren) {
                    node.children.forEach(child => {
                        childNodes.push(...getChildNodes([], child));
                    });
                }
            }

            return childNodes;
        }

        return getChildNodes([], this.node);
    }

    /**
     * Convert our fragment to a constructor function.
     * 
     * @return JsFunction
     */
    public toCode(): JsFunction {
        const content = [];

        // define our various dom elements
        content.push(this.getElementVariables(), null);

        // define any if blocks our fragment has
        content.push(this.defineIfBlocks(), null);

        // return an object with fragment's lifecycle methods
        content.push(new JsReturn({
            value: new JsObject({
                properties: {
                    c: new CreateFn(this).toCode(),
                    h: new HydrateFn(this).toCode(),
                    m: new MountFn(this).toCode(),
                },
            }),
        }));

        return new JsFunction({
            id: this.options.name,
            name: this.options.name,
            signature: ['vm'],
            content,
        });
    }
}

export default Fragment;