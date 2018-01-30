import Code from '../../../generators/code';

export default class BranchSelector extends Code {
    public ifCondition;
    public elseIfConditions;
    public elseCondition;

    constructor(name) {
        super(`
            function #${name}(vm) {
                // :conditions
            }
        `);

        this.ifCondition = null;
        this.elseIfConditions = [];
        this.elseCondition = null;
    }

    //
    // add a conditional branch
    //
    public add(condition, branch) {
        // if
        if (condition && !this.ifCondition) {
            this.ifCondition = condition;
            this.append(`if (${condition}) return ${branch};`, 'conditions');
        }

        // else if

        // else
    }
}