let uniqueId = 0;

/**
 * Create a unique string.
 * 
 * @param  {string} prefix
 * @return {string} 
 */
export default function(prefix: string = ''): string {
    return `${prefix}${uniqueId++}`;
}