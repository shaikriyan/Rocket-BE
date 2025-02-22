import axios from 'axios';
import FormData from 'form-data';
import { configDotenv } from 'dotenv';
configDotenv();
import OpenAI from 'openai';
import readLineSync from 'readline-sync';



const username = process.env.AEM_USER_NAME; 
const password = process.env.AEM_PASSWORD;
const OPEN_AI_API_KEY = process.env.OPEN_AI_API_KEY;


const client = new OpenAI({
    apiKey : OPEN_AI_API_KEY
})


const tools = {
    "replicateContent" : replicateContent
}


async function replicateContent(path, cmd) {
    const url = `${process.env.AEM_DOMAIN}/bin/replicate.json`;


    const form = new FormData();
    form.append('path', path);
    form.append('cmd', cmd);

    try {
        const response = await axios.post(url, form, {
            headers: {
                ...form.getHeaders(),
                'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64')
            }
        });
        console.log('Response:', response.data);
        return response.status.toString();  
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        return error.response ? error.response.status.toString() : '500';
    }
}


const SYSTEM_PROMPT = `

you are an AI Assistant with START, Plan, Action, Observation and Output State.
Wait for the user prompt and first PLAN using available tools.
After Planning, Take the action with appropriate tools and wait for Observation based on Action.
Once you get the observation, Return the AI response based on START prompt and observations 

Strictly follow the json output format as in Example. 

Available Tools:
function replicateContent(path : string, cmd : string) : string
replicateContent is a function that accepts path & cmd as input and return the statusCode of the as output.  


Example : 
START
{ "type": "user", "user" : "Can you publish/activate the following path : '/content/aemgeeks/us/en/author' and unpublish/deactivate this '/content/aemgeeks/us/en/home' ?  "}
{ "type": "plan", "plan" : "I will call the replicateContent for this path '/content/aemgeeks/us/en/author' with cmd as 'activate' "}
{ "type": "action", "function" : "replicateContent", "path" : "/content/aemgeeks/us/en/author", "cmd" : 'activate'}
{ "type": "observation", "observation" : "200"}
{ "type": "plan", "plan" : "I will call the replicateContent for this path '/content/aemgeeks/us/en/home' with cmd as 'deactivate' "}
{ "type": "action", "function" : "replicateContent", "path" : "/content/aemgeeks/us/en/home", "cmd" : 'deactivate'}
{ "type": "observation", "observation" : "200"}
{ "type": "output", "output" : "Success : 200, Both operation of Publishing & Unpublishing are done successfully"}



`;


const message = [
    {role : "system", content : SYSTEM_PROMPT}
    
];



while(true){

    const query = readLineSync.question('>> ');

    const q = {
        type : 'user',
        user : query
    }

    message.push({role : 'user', content : JSON.stringify(q)});

    while(true){
        const chat = await client.chat.completions.create({
            model : 'gpt-4o-mini',
            messages : message,
            response_format : {type : 'json_object'}
        })

        const result = chat.choices[0].message.content;

        console.log("\n\n--------------------------------------START AI --------------------------------------------------")
        console.log(result);
        console.log("--------------------------------------END AI --------------------------------------------------\n\n")


        message.push({role : 'assistant', content : result});

        const call = JSON.parse(result);

        if(call.type === 'output'){
            console.log(` BOT OUTPUT : ${call.output} `);
            break;
        }
        else if(call.type == 'action'){
            const fn = tools[call.function]
            const observation = await fn(call.path, call.cmd);
            const obs = { "type": "observation", "observation" : observation}
            message.push({role : 'developer', content : JSON.stringify(obs)});
        }


    }


}


