import appendNode from './append_node';
import createElement from './create_element';
import createText from './create_text';
import detachNode from './detach_node';
import init from './init';
import insertNode from './insert_node';
import noop from './noop';
import removeStyle from './remove_style';
import setStyle from  './set_style';
import setText from './set_text';
import toggleVisibility from './toggle_visibility';
import { Dep, Watcher } from './observer';

export {
    appendNode,
    createElement,
    createText,
    detachNode,
    init,
    insertNode,
    noop,
    removeStyle,
    setStyle,
    setText,
    toggleVisibility,

    // observer helpers
    Dep,
    Watcher,
};