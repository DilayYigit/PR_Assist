import { Octokit } from "octokit";

const octokit = new Octokit({
    auth: ''   
});

export async function suggestReviewer(context) {
    const info = await context.pullRequest({
        owner: context.payload.repository.owner.login,
        repo: context.payload.repository.name,
        pull_number: context.payload.pull_request.number
    });

    const response = await octokit.request(`GET /repos/${info.owner}/${info.repo}/pulls/${info.pull_number}/files`, {
        headers: { 'Accept': 'application/vnd.github.v3+json' }
    });

    const changedFiles = response.data;
    let topContributors = [];

    for (const file of changedFiles) {
        console.log(file.filename);
        let fileStats = await octokit.request(`GET /repos/${info.owner}/${info.repo}/commits`, {
            headers: { 'Accept': 'application/vnd.github.v3+json' },
            path: file.filename 
        });
        

        if (Array.isArray(fileStats.data) && fileStats.data) { 
            let contributorLineCount = {};

            fileStats.data.forEach(commit => {
                commit.files.forEach(f => {
                    if (f.filename === file.filename) {
                        const authorLogin = commit.author?.login || 'unknown';
                        if (!contributorLineCount[authorLogin]) {
                            contributorLineCount[authorLogin] = { additions: 0, deletions: 0 };
                        }
                        contributorLineCount[authorLogin].additions += f.additions;
                        contributorLineCount[authorLogin].deletions += f.deletions;
                    }
                });
            });
        }

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
        reviewers: topContributors.map(contributor => contributor.contributor),
        headers: { 'Accept': 'application/vnd.github+json' },
    });
    console.log(response2.data);
    return response2.status;
}

