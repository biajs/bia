import Code from '../../../generators/code';

export default class BranchSelector extends Code {
    public elseCondition;
    public elseIfConditions;
    public ifCondition;
    public ifNode;

    constructor(name) {
        super(`
            function #${name}(vm) {
                :conditions
            }
        `);

        this.ifCondition = null;
        this.elseIfConditions = [];
        this.elseCondition = null;
    }

    //
    // add a conditional branch
    //
    public add(currentNode, branch, condition = null) {
        // if / else-if
        if (condition) {
            this.append(`if (${condition}) return ${branch};`, 'conditions');
        }

        // else
        else this.append(`return ${branch};`, 'conditions');
    }
}