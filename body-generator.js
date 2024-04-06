import {OpenAIClient, AzureKeyCredential} from '@azure/openai'

const endpoint = "https://amirtest.openai.azure.com/";
const azureApiKey = '5a245cbd34374444a17808a1160b32d3';

export async function generateBody(context) {

    try {
        // Get the diff of the pull request
        const diff = await context.octokit.pulls.get({
            owner: context.payload.repository.owner.login,
            repo: context.payload.repository.name,
            pull_number: context.payload.pull_request.number
        }).then(response => response.data.diff);

        console.log(diff);

        const prompt = [`The changes in this pull request are:\n\n${diff}\n\nPlease provide a concise description of the changes.`];

        const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
        const deploymentId = "gpt35Test";
        const result = await client.getCompletions(deploymentId, prompt);

        for (const choice of result.choices) {
            console.log(choice.text);
        }
        return result.choices[0].text;

    } catch (e) {
        console.error("The sample encountered an error:", e);


    }


}


