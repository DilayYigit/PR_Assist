import { generateBody } from './body-generator.js';

let body = '';

export default (app) => {
    app.on('pull_request.opened', async (context) => {
        body = await generateBody(context);
        const params = context.issue({
            body
        });

        // Create a comment on the pull request
        return context.octokit.issues.createComment(params);
    });

    //TODO Fix this
    app.on('issue_comment.created', async (context) => {
        const issuePullRequest = context.payload.issue.pull_request;
        const commentBody = context.payload.comment.body;

        if (!issuePullRequest) return; // Return early if this is not a pull request

        if (commentBody.trim() === 'Update') {
            const newTitle = 'Your New Title Here'; // Set your new title here

            const params = context.issue({
                title: newTitle
            });

            // Update the pull request description
            return context.octokit.pulls.update(params);
        }
    });
};