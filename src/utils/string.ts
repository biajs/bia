import { indentationString } from './constants';

export function collapseNewlines(source: string): string {
    return source.replace(/\n\s*\n+/g, "\n\n");
}

/**
 * Escape a string for use as javascript source.
 * 
 * @param  {string} source
 * @return {string}
 */
export function escape(source: string): string {
    return source
        .replace(/\n/g, '\\r\\n')     // new lines
        .replace(/'/g, '\\\'')        // single quotes
        .replace(/"/g, '\\\"')        // double quotes
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