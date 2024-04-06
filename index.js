import { generateBody } from './body-generator.js';

export default (app) => {
    app.on('pull_request.opened', async (context) => {
        const body = await generateBody(context);
        const params = context.issue({
            body
        });

        // Create a comment on the pull request
        return context.octokit.issues.createComment(params);
    });
};