import axios from "axios";
import FormData from "form-data";
import { configDotenv } from "dotenv";
configDotenv({ path: "../.env" });

// --- Environment Variables with Fallback and Warnings ---
const AEM_DOMAIN = process.env.AEM_DOMAIN || "http://localhost:4502";
const AEM_USER_NAME = process.env.AEM_USER_NAME || "admin";
const AEM_PASSWORD = process.env.AEM_PASSWORD || "admin";

if (!process.env.AEM_DOMAIN) console.warn("⚠️ Using default AEM_DOMAIN");
if (!process.env.AEM_USER_NAME || !process.env.AEM_PASSWORD)
  console.warn("⚠️ Using default AEM credentials");

const AUTH_HEADER = {
  Authorization:
    "Basic " +
    Buffer.from(`${AEM_USER_NAME}:${AEM_PASSWORD}`).toString("base64"),
};

// --- Core Replication Function ---
async function replicateContent(path, cmd) {
  const url = `${AEM_DOMAIN}/bin/replicate.json`;

  const form = new FormData();
  form.append("path", path);
  form.append("cmd", cmd);

  try {
    const response = await axios.post(url, form, {
      headers: { ...form.getHeaders(), ...AUTH_HEADER },
    });

    console.log(`✅ [${cmd.toUpperCase()}] success for ${path}`);
    return response.data;
  } catch (error) {
    console.error(
      `❌ [${cmd.toUpperCase()}] failed for ${path}`,
      error.response?.data || error.message
    );
    return error.response?.status.toString() || "500";
  }
}

// --- Command Wrappers ---
const replicate = (cmd) => async (path) => {
  const result = await replicateContent(path, cmd);
  console.log(`📦 Response Data [${cmd.toUpperCase()}]:`, result);
  return result;
};

const publish = replicate("activate");
const unPublish = replicate("deactivate");

export { publish, unPublish };
