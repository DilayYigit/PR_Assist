import {OpenAIClient, AzureKeyCredential} from '@azure/openai'
import axios from 'axios'

const endpoint = "https://amirtest.openai.azure.com/";
const azureApiKey = '5a245cbd34374444a17808a1160b32d3';

export async function generateBody(context) {

    try {
        // Get the diff of the pull request
        const info = await context.pullRequest({
            owner: context.payload.repository.owner.login,
            repo: context.payload.repository.name,
            pull_number: context.payload.pull_request.number
        })
        // console.log(info);
        let diffFiles = null;

        try {
            const response = await axios.get(`https://api.github.com/repos/${info.owner}/${info.repo}/pulls/${info.pull_number}/files`, {
                headers: {
                    'Accept': 'application/vnd.github.v3.diff',
                }
            });

            diffFiles = response.data.map((file) => {
                return file.patch;
            });

            // console.log(diffFiles)

        } catch (error) {
            console.error('Error getting diff files:', error);
        }


        const prompt = [`The changes in this pull request are:\n\n${diffFiles}\n\nPlease provide a concise description of the changes.`];

        const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
        const deploymentId = "gpt35Test";
        const result = await client.getCompletions(deploymentId, prompt);

        for (const choice of result.choices) {
            console.log(choice.text);
        }
        return result.choices[0].text;

    } catch
        (e) {
        console.error("The sample encountered an error:", e);


    }


}


