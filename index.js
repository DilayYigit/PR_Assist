import {generateBody} from './body-generator.js';

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

    // //TODO Fix this

    app.on('issue_comment.created', async (context) => {
        const comment = context.payload.comment.body;
        const pullRequest = context.payload.issue.pull_request;

        if (pullRequest && comment === 'Update') {
            const newTitle = 'Updated Title'; // Replace with the desired new title
            const newDescription = 'Updated Description'; // Replace with the desired new description

            const updateParams = context.issue({
                title: newTitle,
                body: newDescription
            });
            await context.octokit.issues.update(updateParams)
        }
    });
};