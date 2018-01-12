import { JsAssignment, JsCode, JsFunction, JsIf } from '../../code/index';
import { JsFragment } from '../functions/JsFragment';
import { DomProcessor, JsFragmentNode, NodeDirective, ParsedNode } from '../../../interfaces';

//
// helpers
//
import { 
    appendNode, 
    createText,
} from '../helpers/index';

//
// utils
//
import {
    findRootIdentifiers,
    namespaceRootIdentifiers,
} from '../../../utils/code';

import {
    hasProcessingFlag ,
    hasTextInterpolations,
    isTextNode,
} from '../../../utils/parsed_node';

import {
    escape,
    splitTextInterpolations,
} from '../../../utils/string';

/**
 * Process the current node.
 * 
 * @param  {JsCode}                 code
 * @param  {ParsedNode}             currentNode
 * @param  {Array<JsFragmentNode>}  fragments 
 */
export function process(code: JsCode, currentNode: ParsedNode, fragment: JsFragment) {
    // do nothing if the current node isn't a text node or was already created
    if (
        !isTextNode(currentNode) ||
        hasProcessingFlag(currentNode, 'wasCreatedBySetText') ||
        hasProcessingFlag(currentNode, 'wasCreatedByInnerHTML')
    ) {
        return;
    }

    // define our text node, and get the parent element's var name
    const varName = fragment.getVariableName(currentNode, 'text');
    const parentVarName = fragment.getVariableName(currentNode.parent);

    // use the createText and appendNode helpers
    code.useHelper(createText);
    code.useHelper(appendNode);

    // if we have text interpolations, process the dynamic text
    if (currentNode.textInterpolations.length > 0) {
        processDynamicText(currentNode, fragment, varName, parentVarName);
    }

    // otherwise process the static text node
    else {
        processStaticText(currentNode, fragment, varName, parentVarName);
    }

    // // otherwise split the text so we process dynamic and static parts
    // splitTextInterpolations(currentNode.textContent).forEach(text => {

    //     // when naming these text variables, we need to clone the current node
    //     // object so they each get a unique identifier. this is neccessary
    //     // because one node might have both static and dynamic content.
    //     const varName = fragment.getVariableName({ ...currentNode }, 'text');
    //     const parentVarName = fragment.getVariableName(currentNode.parent);

    //     // define
    //     fragment.define(varName);

    //     // create
    //     code.useHelper(createText);
        
    //     if (text.startsWith('{{')) {
    //         // dynamic text
    //         const expression = text.slice(2, -2).trim();
    //         fragment.create.append(`${varName} = createText(${namespaceIdentifiers(expression, 'vm', fragment.scope)});`);
    //     } else {
    //         // static text
    //         fragment.create.append(`${varName} = createText('${escape(text)}');`);
    //     }

    //     // mount
    //     code.useHelper(appendNode);
    //     fragment.mount.append(`appendNode(${varName}, ${parentVarName});`);
    // });
}

//
// dynamic
//
function processDynamicText(
    currentNode: ParsedNode, 
    fragment: JsFragment, 
    varName: string, 
    parentVarName: string
) {
    const fnName = varName + '_content';

    // build up our string concatenation, and track the dependencies
    const dependencies = [];
    const concatenation = splitTextInterpolations(currentNode.textContent)
        .reduce((segments, text) => {
            if (text.startsWith('{{')) {
                const expression = text.slice(2, -2).trim();
                dependencies.push(expression);
                return segments.concat(namespaceRootIdentifiers(expression, 'vm', fragment.scope));
            }

            return segments.concat(`'${escape(text)}'`);
        }, [])
        .join(' + ');

    // define our text node
    fragment.define(varName);
    
    // define a function to concatenation the text content
    fragment.code.append(new JsFunction({
        name: fnName,
        content: [`return ${concatenation};`]
    }));

    // create
    fragment.create.append(`${varName} = createText(${fnName}());`);

    // mount
    fragment.mount.append(`appendNode(${varName}, ${parentVarName});`);

    // update
    fragment.update.append(new JsIf({
        condition: getChangedCondition(dependencies, fragment.scope),
        content: [
            `${varName}.data = ${fnName}();`,
        ],
    }));
}

//
// build up a condition to check if a text node's dependencies have changed
//
function getChangedCondition(dependencies, scope) {
    const conditions = [];

    dependencies.forEach(dependency => {
        const expression = [];
        const subCondition = [];
        const parts = dependency.split('.');

        parts.forEach(part => {
            expression.push(part);
            subCondition.push(expression.join('.'));
        });

        conditions.push(subCondition.length > 1 ? `(${subCondition.join(' && ')})` : subCondition[0]);
    });

    return namespaceRootIdentifiers(conditions.join(' || '), 'changed', scope);
}

//
// process a static text node
//
function processStaticText(
    currentNode: ParsedNode, 
    fragment: JsFragment, 
    varName: string, 
    parentVarName: string
) {
    // create
    fragment.create.append(`${varName} = createText('${escape(currentNode.textContent)}');`);

    // mount
    fragment.mount.append(`appendNode(${varName}, ${parentVarName});`);
}