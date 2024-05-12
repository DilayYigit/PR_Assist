import {Octokit} from "octokit";
import axios from 'axios';

const octokit = new Octokit({
    //
    auth: '' // TODO: REPLACE WITH YOUR GITHUB TOKEN
})

export async function suggestReviewer(context) {


    const info = await context.pullRequest({
        owner: context.payload.repository.owner.login,
        repo: context.payload.repository.name,
        pull_number: context.payload.pull_request.number
    })


    const response = await octokit.request(`GET /repos/${info.owner}/${info.repo}/pulls/${info.pull_number}/files`, {
        headers: {
            'Accept': 'application/vnd.github.v3+json',
        }
    });


    const changedFiles = response.data;

    let fileNames = [''];

    changedFiles.forEach(file => {
        fileNames.push(file.filename)
    });

    const response2 = await octokit.request(`GET /repos/${info.owner}/${info.repo}/contributors`, {
        headers: {
            'Accept': 'application/vnd.github.v3+json',
        }
    });
    const contributors = response2.data;


    // Create an object to store the line counts for each contributor
    const contributorLineCount = {};
    contributors.forEach(contributor => {
        contributorLineCount[contributor.login] = {additions: 0, deletions: 0};
    });


}


