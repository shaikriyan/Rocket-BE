import axios from "axios";
import { configDotenv } from "dotenv";
configDotenv({ path: "../.env" });

const username = process.env.AEM_USER_NAME;
const password = process.env.AEM_PASSWORD;
const aemDomain = process.env.AEM_DOMAIN;

async function fetchAEMData(path, selector = "model") {
    console.log(`username: ${username} ; password: ${password} ; aemDomain: ${aemDomain}`);

    const url = `${aemDomain}${path}.${selector}.json`;

    try {
        const response = await axios.get(url, {
            headers: {
                Accept: "application/json",
                Authorization: "Basic " + Buffer.from(`${username}:${password}`).toString("base64"),
            },
        });

        return response.data; // ✅ Already parsed JSON
    } catch (error) {
        console.error("Error fetching data from AEM:", error.response ? error.response.data : error.message);
        throw error;
    }
}

const result = await fetchAEMData("/content/we-retail/us/en/men");

console.log("result : ", result);
