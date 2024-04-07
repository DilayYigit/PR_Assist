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
                "content": "Please generate a concise description and title for a pull request based on the provided diff files. Here's an example of your output format: \"Title\": \"\" \n \"Description\": "
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


