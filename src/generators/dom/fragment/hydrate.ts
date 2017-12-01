import Fragment from './fragment';
import { JsCode, JsFunction } from '../../classes/index';
import { escapeJsString } from '../../../utils/string';
import { ParsedNode } from '../../../interfaces';
import { setClass, setStyle } from '../global_functions';

class FragmentHydrate {
    public fragment: Fragment;

    /**
     * Constructor
     * 
     * @param {Fragment} fragment
     */
    constructor(fragment) {
        this.fragment = fragment;
    }

    /**
     * Set element classes.
     * 
     * @param  {Array<ParsedNode>} nodes
     * @return {JsCode}
     */
    public setClasses(nodes: Array<ParsedNode>): JsCode {
        const content = [];
        const globalFunctions = [];

        nodes.forEach(node => {
            if (node.staticClasses.length) {
                const varName = this.fragment.getName(node);
                content.push(`setClass(${varName}, '${escapeJsString(node.staticClasses.join(' '))}');`);
            }
        });

        // @todo: add logic for dynamic classes

        // if we have any logic here, include the setClass fn
        if (content.length) {
            globalFunctions.push(setClass());
        }

        return new JsCode({
            content,
            globalFunctions,
        });
    }

    /**
     * Set element data attributes.
     * 
     * @param  {Array<ParsedNode>}  nodes
     * @return {Array>string>}
     */
    public setDataAttributes(nodes): JsCode {
        const content = nodes.filter(node => Object.keys(node.attributes).length)
            .reduce((attrs, node) => {
                const varName = this.fragment.getName(node);
                
                Object.keys(node.dataAttributes).forEach(key => {
                    const value = node.dataAttributes[key];
                    attrs.push(`${varName}.dataset.${key} = '${escapeJsString(value)}';`);
                });

                return attrs;
            }, []);

        return new JsCode({
            content,
        });
    }

    /**
     * Set element inline styles.
     * 
     * @param  {Array<ParsedNode>}  nodes 
     * @return {Array<string>}
     */
    public setStyles(nodes: Array<ParsedNode>): JsCode {
        const content = [];
        const globalFunctions = [];

        // set static styles
        nodes.forEach(node => {
            const varName = this.fragment.getName(node);
            Object.keys(node.staticStyles).forEach((key) => {
                const value = node.staticStyles[key];
                content.push(`setStyle(${varName}, '${key}', '${value}');`);
            });
        });

        // @todo: add logic for dynamic styles

        // if we have any logic here, include the setStyle fn
        if (content.length > 0) {
            globalFunctions.push(setStyle());
        }

        return new JsCode({
            globalFunctions,
            content,
        });
    }

    /**
     * Convert to a fragment hydrate function.
     * 
     * @return {JsCode}
     */
    public toCode(): JsCode {
        const content = [];
        const globalFunctions = [];
        const nodes = this.fragment.getChildNodes();

        // set various element attributes
        content.push(this.setClasses(nodes));
        content.push(this.setStyles(nodes));
        content.push(this.setDataAttributes(nodes));

        return content.filter(code => code.content.length).length
            ? new JsFunction({ name: 'hydrate', globalFunctions, content })
            : new JsCode({ content: ['noop'] });
    }
}

export default FragmentHydrate;