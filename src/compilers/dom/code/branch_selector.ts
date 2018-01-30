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
        // if
        if (condition && !this.ifCondition) {
            this.ifNode = currentNode;
            this.ifCondition = condition;
            this.append(`if (${condition}) return ${branch};`, 'conditions');
        }

        // else if

        // else
        else if (!condition && !this.elseCondition) {
            console.log ('appending else');
            this.append(`return ${branch};`, 'conditions');
        }
    }

    public toString() {
        console.log();
        console.log();
        console.log(this.containers);
        console.log();
        console.log();
        console.log(super.toString());
        console.log();
        console.log();
        return super.toString();
    }
}