import { Octokit } from "octokit";
import axios from 'axios';

const octokit = new Octokit({
    auth: 'YOUR_GITHUB_TOKEN' // TODO: REPLACE WITH YOUR GITHUB TOKEN
  })

export async function suggestReviewer(context) {

    try {
        const info = await context.pullRequest({
            owner: context.payload.repository.owner.login,
            repo: context.payload.repository.name,
            pull_number: context.payload.pull_request.number
        })

        try {
            const response = await octokit.request(`GET /repos/${info.owner}/${info.repo}/activity`, {
                headers: {
                    'Accept': 'application/vnd.github+json',
                }
            });

            //console.log(response.data);
            const len = response.data.length;
            let contributor = '';
            for (let i = 0; i < len; i++) {
                if (response.data[i].activity_type === 'push') {
                    contributor = response.data[i].actor.login;
                    break;
                }   
            }
        
            //console.log(contributor);
            const response2 = await octokit.request(`POST /repos/${info.owner}/${info.repo}/pulls/${info.pull_number}/requested_reviewers`, {
                reviewers: [
                    contributor
                ],
                headers: {
                    'Accept': 'application/vnd.github+json',
                }
            });
            //console.log(response2.data);
            return response2.status;

        } catch (error) {
            console.error('Error getting the activity:', error);
        }
    } catch (error) {
            console.error("Error with the GitHub Pull Request:", error);
    }
}


