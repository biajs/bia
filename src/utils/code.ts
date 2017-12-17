import { ParsedNode } from '../interfaces';
import { isElementNode, isTextNode } from './parsed_node';
import { BaseCode } from '../generators/code/BaseCode';

// determine if an object is a code instance
export function isCodeInstance(obj) {
    return obj instanceof BaseCode;
}