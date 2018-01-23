import { indentationString } from './constants';

export function collapseNewlines(source: string): string {
    return source.replace(/\n\s*\n+/g, "\n\n");
}

// deindent a string
export function deindent(source: string) {
    let lines = source.split('\n');

    // remove leading and trailing whitespace
    while (isWhitespace(lines[0])) lines = lines.slice(1);
    while (isWhitespace(lines[lines.length - 1])) lines = lines.slice(0, lines.length - 1);

    // trim lines that are entirely whitespace
    lines = lines.map(line => line.match(/^\s*$/g) ? '' : line);

    // itterate over each remaining line and find the smallest indentation
    let smallestIndentation = null;

    for (let i = 0, len = lines.length; i < len; i++) {
        // @todo: adjust this regex so we don't need to do the -1 nonsense
        const indentation = lines[i].match(/^\s*\S/g);
        
        if (indentation && (!smallestIndentation || indentation[0].length - 1 < smallestIndentation)) {
            smallestIndentation = indentation[0].length - 1;
        }
    }

    // itterate over each line again, and remove the indentation
    if (smallestIndentation) {
        const re = new RegExp(`^\\s{0,${smallestIndentation}}`, 'g');
        lines = lines.map(line => line.replace(re, ''));
    }

    return lines.join('\n');
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

// find the line of a particular offset
export function findLineAtOffset(source: string, offset: number): string {
    return source.split('\n')[findLineIndexAtOffset(source, offset)];
}

// find the line index of a particular offset
export function findLineIndexAtOffset(source, offset) {
    return (source.slice(0, offset).match(/\n/g) || []).length;
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

// determine if a string represents a text interpolation
export function isInterpolation(text: string): boolean {
    return text.startsWith('{{') && text.endsWith('}}');
}

// determine if a string is nothing but whitespace
export function isWhitespace(text: string): boolean {
    return !!text.match(/^\s*$/g);
}

// split a string with interpolations
export function splitInterpolations(source: string): Array<string> {
    // this regex matches text interpolations, and takes special
    // care not to match quoted braces inside interpolations
    //
    // examples: https://regexr.com/3jjr6
    const re = /{{[^]*?(?:(?:('|"|`)[^\1]*?[^\\]\1)[^]*?)*}}/g;

    let index = 0;
    let interpolations = [];
    
    // @todo: create this control flow without relying on String.replace
    source.replace(re, (match, _, pos) => {        
        if (pos > 0) {
            interpolations.push(source.slice(index, pos));
        }

        interpolations.push(match);
        index += pos + match.length;
        return '';
    });

    if (index === 0 && source.length) {
        interpolations.push(source);
    } else if (index < source.length) {
        interpolations.push(source.slice(index));
    }

    return interpolations;
}