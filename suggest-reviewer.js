import {Octokit} from "octokit";

const octokit = new Octokit({
    auth: '' // TODO: REPLACE WITH YOUR GITHUB TOKEN
})

export async function suggestReviewer(context, set) {
    let suggesteeReviewer = ''
    let owener = ''
    let repo = ''
    let number = 0

    if (set === 0) {
        const info = await context.pullRequest({
            owner: context.payload.repository.owner.login,
            repo: context.payload.repository.name,
            pull_number: context.payload.pull_request.number
        })
        const pullRequestOwner = context.payload.pull_request.user.login;
        owener = info.owner
        repo = info.repo
        number = info.pull_number

        const response = await octokit.request(`GET /repos/${info.owner}/${info.repo}/pulls/${info.pull_number}/files`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
            }
        });
        const changedFiles = response.data;
        let fileNames = [];
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
            contributorLineCount[contributor.login] = 0;
        });


        const response3 = await octokit.request(`GET /repos/${info.owner}/${info.repo}/commits`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
            }
        });
        for (const commit of response3.data) {
            const responseTemp = await octokit.request(`GET /repos/${info.owner}/${info.repo}/commits/${commit.sha}`, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                }
            });
            const filesChanged = responseTemp.data.files.map(file => file);
            fileNames.forEach(fileName => {
                const filesExist = filesChanged.some(file => file.filename.includes(fileName));
                if (filesExist) {
                    const fileFound = filesChanged.find(file => file.filename.includes(fileName));
                    contributorLineCount[commit.author?.login] += fileFound.additions;
                    contributorLineCount[commit.author?.login] += fileFound.deletions;
                }
            })

        }
        console.log(contributorLineCount)

        const filteredContributorLineCount = Object.fromEntries(
            Object.entries(contributorLineCount)
                .filter(([key, value]) => key !== 'undefined' && !isNaN(value))
        );
        const contributorLineCountArray = Object.entries(filteredContributorLineCount);
        contributorLineCountArray.sort((a, b) => b[1] - a[1]);
        console.log(contributorLineCountArray);

        const nonOwnerContributor = Object.entries(filteredContributorLineCount).find(([key, value]) => key !== pullRequestOwner);
        if (nonOwnerContributor) {
            console.log(`Non-owner contributor: ${nonOwnerContributor[0]}`);
            suggesteeReviewer = nonOwnerContributor[0]
            return suggesteeReviewer;
        } else {
            console.log("Empty");
        }
    } else {
        if (suggesteeReviewer !== '') {
            const response2 = await octokit.request(`POST /repos/${owener}/${repo}/pulls/${number}/requested_reviewers`, {
                reviewers: [
                    suggesteeReviewer
                ],
                headers: {
                    'Accept': 'application/vnd.github+json',
                }
            });
        }
    }
}


