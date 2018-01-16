import { JsHelper } from '../../code/JsHelper';

/**
 * Create a comment.
 * 
 * @return {JsFunction}
 */
export default new JsHelper({
    id: 'createComment',
    name: 'createComment',
    signature: ['text'],
    content: [
        `return document.createComment(text);`,
    ],
});