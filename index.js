import {generateBody} from './body-generator.js';
import {suggestReviewer} from './suggest-reviewer.js';

let body = '';
let status = null;

export default (app) => {
    app.on('pull_request.opened', async (context) => {
        body = await generateBody(context);
        const params = context.issue({
            body
        });

        return context.octokit.issues.createComment(params);
    });

    app.on('pull_request.opened', async (context) => {
        status = await suggestReviewer(context);
        return status;
    });

    app.on('issue_comment.created', async (context) => {
        const comment = context.payload.comment.body;
        const pullRequest = context.payload.issue.pull_request;
        const newTitle = body.split("Pull Request Body:")[0].trim();
        const newDescription = body.split("Pull Request Body:")[1].trim();

        if (pullRequest && comment.trim().toLowerCase() === 'update') {
            const updateParams = context.issue({
                title: newTitle,
                body: newDescription
            });
            await context.octokit.issues.update(updateParams)
        }
    });
};