import { indentationString } from './constants';

export function escapeQuotes(source: string): string {
    return source
        .replace(/'/g, '&#39;')
        .replace(/"/g, '&#34;');
}

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