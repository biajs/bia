import { 
    JsIf,
    JsCode,
    JsFunction,
    JsObject,
    JsVariable,
} from '../classes';

/**
 * Build up a functions to control a dom fragment.
 * 
 * @param {Object} template
 */
export default function(name: string, template) {
    return new JsFunction({
        signature: ['vm', 'state'],
        name: name,
        content: [
            // create containers for each of our dom elements
            defineFragmentVariables(template),
            null,

            // return an object with methods to control our dom fragment
            `return ${fragmentFunctionsObject(template)};`,
        ]
    });
}

/**
 * Define the variables neccessary to build a dom fragment.
 * 
 * @param  {Object} template
 * @return {Object}
 */
function defineFragmentVariables(template) {
    return new JsVariable({
        define: [template.tagName.toLowerCase()],
    });
}

/**
 * Define the functions neccessary to build a dom fragment.
 * 
 * @param  {Object}
 */
function fragmentFunctionsObject(template) {
    // this will eventually hold create, destroy, mount, and unmount
    return new JsObject({
        properties: {
            c: getCreateFn(template),
            m: getMountFn(template),
        },
    });
}

/**
 * Function to create a new dom fragment.
 * 
 * @param  {Object} template
 * @return {Object}
 */
function getCreateFn(template) {
    return new JsFunction({
        name: 'c',
        content: [
            `div = createElement('div');`,
            `div.innerHTML = 'foooooo';`
        ],
    });
}

/**
 * Function to insert a fragment into the dom.
 * 
 * @param  {Object} template
 * @return {Object} 
 */
function getMountFn(template) {
    return new JsFunction({
        name: 'm',
        signature: ['target'],
        content: [
            `insertNode(div, target);`,
        ],
    });
}