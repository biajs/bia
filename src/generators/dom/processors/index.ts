import * as conditionals from './conditionals';
import * as textNodes from './text_nodes';
import * as elements from './element';
import * as loops from './loops';
import * as showDirective from './show_directive';
import * as staticClasses from './static_classes';
import * as staticStyles from './static_styles';

export default [
    conditionals,       // <- create fragments for logical branches
    elements,           // <- manage dom elements
    loops,              // <- create fragments for looped content
    showDirective,      // <- manage display inline style
    staticClasses,      // <- manage static classes
    staticStyles,       // <- manage static styles
    textNodes,          // <- manage text nodes
]