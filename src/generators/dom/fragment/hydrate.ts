import { ParsedNode, TextInterpolation } from '../../../interfaces';
import { VariableNamer } from '../../../utils/code';
import { escapeJsString } from '../../../utils/string';
import { nodeHasDirective, nodeRequiresHydration } from '../../../utils/parsed_node';
import { setClass, setStyle } from './../global_functions';

import { 
    JsCode,
    JsFunction,
    JsIf,
    JsObject,
    JsReturn,
    JsVariable,
} from '../../classes/index';

/**
 * Function to hydrate a node's dom elements.
 * 
 * @param  {ParsedNode}     node
 * @param  {Array<NodeVar>} nodeVars
 * @return {JsFunction} 
 */
export default function (node: ParsedNode, nodeNamer: VariableNamer): JsCode {
    // if the node doesn't need hydration, use noop
    if (!nodeRequiresHydration(node)) {
        return new JsCode({ content: ['noop'] });
    }

    return new JsFunction({
        name: 'hydrate',
        content: [
            hydrateDomElements(node, nodeNamer),
        ],
    });
}

/**
 * Attach classes to a node.
 * 
 * @param  {ParsedNode}     node
 * @param  {string}         varName
 * @return {JsCode}
 */
function attachClasses(node: ParsedNode, varName: string) {
    const content = [];
    const globalFunctions = [];

    // start with all of our static classes that we know will be attached
    if (node.staticClasses.length) {
        const classes = node.staticClasses.slice(0);

        content.push(`setClass(${varName}, '${escapeJsString(classes.join(' '))}')`);
        globalFunctions.push(setClass());
    }

    // @todo: handle dynamic classes
    
    return new JsCode({
        content,
        globalFunctions,
    });
}

/**
 * Attach data attributes to a node.
 * 
 * @param  {ParsedNode}     node
 * @param  {string}         varName
 * @return {JsCode}
 */
function attachDataAttributes(node: ParsedNode, varName: string) {
    const attrNames = Object.keys(node.dataAttributes);

    if (attrNames.length > 0) {
        const content = attrNames.map(name => {
            return `${varName}.dataset.${name} = '${escapeJsString(node.dataAttributes[name])}'`
        });

        return new JsCode({ content });
    }
}

/**
 * Attach styles to a node.
 * 
 * @param  {ParsedNode}     node
 * @param  {string}         varName
 * @return {JsCode}
 */
function attachStyles(node: ParsedNode, varName: string) {
    // start with all of our static styles that we know will be attached
    const styles = Object.keys(node.staticStyles).reduce((content, styleProperty) => {
        const property = escapeJsString(styleProperty);
        const value = escapeJsString(node.staticStyles[styleProperty]);

        content.push(`setStyle(${varName}, '${property}', '${value}');`);

        return content;
    }, []);

    // @todo: handle dynamic styles

    // attach our setStyle function if neccessary
    const globalFunctions = styles.length
        ? [setStyle()]
        : [];
    
    return new JsCode({
        globalFunctions,
        content: styles,
    });
}

/**
 * Recursively hydrate dom elements.
 * 
 * @param  {ParsedNode}     node 
 * @param  {VariableNamer}  nodeNamer 
 * @return {JsCode}
 */
function hydrateDomElements(node: ParsedNode, nodeNamer: VariableNamer): JsCode {
    const content = [];
    const varName = nodeNamer.getName(node);

    if (node.type === 'ELEMENT') {
        content.push(
            attachClasses(node, varName),
            attachDataAttributes(node, varName),
            attachStyles(node, varName),
            ...node.children.map(child => hydrateDomElements(child, nodeNamer)),
        );
    }

    return new JsCode({
        content,
    });
}