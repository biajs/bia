import * as conditionals from './conditionals';
import * as elements from './element';
import * as staticClasses from './static_classes';
import * as staticTextNodes from './static_text_nodes';

export default [
    conditionals,    // <- create fragments for logical branches
    elements,        // <- manage dom elements
    staticClasses,   // <- manage static classes
    staticTextNodes, // <- manage static text nodes
]