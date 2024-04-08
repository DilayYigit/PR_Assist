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



        const m = [
            {
                "role": "system",
                "content": "Create a descriptive pull request title based on the provided code differences. First word of PR title should start with a lowercase letter. Title MUST be in English. Title should MUST be prefixed with a type, which consists of a noun like feat (when PR adds a new feature), fix (when PR represents a bug fix), chore, refactor. Some example titles: 'feat: adding login authentication configurations', 'fix: fatal error when trying to sign up on Chrome'. Please give me a title that meets all requirements. PR Body should summarize the changes and their impact. Example PR body format: Pull Request Body: 1. \"Overview of Changes:\" \"\" \"2. Detailed Description of Changes:\" \"\". Your output format should be like: \"AI Generated PR Title\": \"\" \n \"AI Generated PR Body\": "
            },
            {
                "role": "user",
                "content": `${diffFiles}`
            }
        ];


        const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
        const deploymentId = "gpt35";
        const result2 = await client.getChatCompletions(deploymentId, m);





        console.log(result2.choices[0])
        return result2.choices[0].message.content


    } catch
        (e)
        {
            console.error("The sample encountered an error:", e);


        }


    }


