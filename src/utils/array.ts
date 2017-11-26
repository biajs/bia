/**
 * Determine if an array has duplicate members.
 * 
 * @param  {Array<any>}     arr
 * @return {boolean}
 */
export function hasDuplicateMembers(arr: Array<any>): boolean {
    return (new Set(arr)).size !== arr.length;
}

/**
 * Get the duplicate members of an array.
 * 
 * @param  {Array<any>}     arr
 * @return {Array<any>}
 */
export function getDuplicateMembers(arr: Array<any>): Array<any> {
    return getUniqueMembers(arr.filter(duplicateMember => {
        return arr.filter(occurrenceMember => occurrenceMember === duplicateMember).length > 1;
    }));
}

/**
 * Get the unique members of an array.
 * 
 * @param  {Array<any>}     arr
 * @return {Array<any>}
 */
export function getUniqueMembers(arr: Array<any>): Array<any> {
    return arr.filter((member, i, a) => a.indexOf(member) == i);
}