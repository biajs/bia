import { indentationString } from './constants';

/**
 * Indent a string.
 * 
 * @param  {string} source
 * @param  {string} depth
 * @return {string}
 */
export function indent(source: string, depth: number = 1): string {
    return source.split('\n').map(line => indentationString + line).join('\n');
}