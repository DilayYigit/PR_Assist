import {Octokit} from "octokit";

const octokit = new Octokit({
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
    let topContributors = [];

    for (const file of changedFiles) {
        let fileStats = await octokit.request(`GET /repos/${info.owner}/${info.repo}/commits`, {
            path: file.filename,
            headers: {
                'Accept': 'application/vnd.github.v3+json',
            }
        });

        let contributorLineCount = {};

        fileStats.data.forEach(commit => {
            commit.files.forEach(f => {
                if (f.filename === file.filename) {
                    if (!contributorLineCount[commit.author.login]) {
                        contributorLineCount[commit.author.login] = { additions: 0, deletions: 0 };
                    }
                    contributorLineCount[commit.author.login].additions += f.additions;
                    contributorLineCount[commit.author.login].deletions += f.deletions;
                }
            });
        });

        let maxLines = 0;
        let topContributor = null;
        for (const [login, { additions, deletions }] of Object.entries(contributorLineCount)) {
            let totalChanges = additions + deletions;
            if (totalChanges > maxLines) {
                maxLines = totalChanges;
                topContributor = login;
            }
        }

        if (topContributor) {
            topContributors.push({ filename: file.filename, contributor: topContributor });
        }
    }

    console.log(topContributors);

    const response2 = await octokit.request(`POST /repos/${info.owner}/${info.repo}/pulls/${info.pull_number}/requested_reviewers`, {
        reviewers: [
            topContributors
        ],
        headers: {
            'Accept': 'application/vnd.github+json',
        }
    });
    //console.log(response2.data);
    return response2.status;



}


