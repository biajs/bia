import code from '../../generators/code';

export default class {
    protected vars: Array<string> = [];
    protected name: string = 'create_main_fragment';

    public toString() {
        return code(`
            // fragment code!
        `)
    }
}