import * as conditionals from './conditionals';
import * as elements from './element';
import * as loops from './loops';
import * as showDirective from './show_directive';
import * as staticClasses from './static_classes';
import * as staticStyles from './static_styles';
import * as staticTextNodes from './static_text_nodes';

export default [
    loops,              // <- create fragments for looped content
    conditionals,       // <- create fragments for logical branches
    elements,           // <- manage dom elements
    staticClasses,      // <- manage static classes
    staticStyles,       // <- manage static styles
    staticTextNodes,    // <- manage static text nodes
    showDirective,      // <- manage display inline style
]