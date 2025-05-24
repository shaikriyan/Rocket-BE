import axios from "axios";
import FormData from "form-data";
import { configDotenv } from "dotenv";
configDotenv({ path: "../.env" });


const AEM_DOMAIN = process.env.AEM_DOMAIN || "http://localhost:4502";
const AEM_USER_NAME = process.env.AEM_USER_NAME || "admin";
const AEM_PASSWORD = process.env.AEM_PASSWORD || "admin";

const auth = { username: AEM_USER_NAME, password: AEM_PASSWORD };


// async function createPage({ parentPath, template, title, pageName = "" }) {
//   const url = `${AEM_DOMAIN}/libs/wcm/core/content/sites/createpagewizard/_jcr_content`;

//   const body = new URLSearchParams({
//     _charset_: "utf-8",
//     parentPath,
//     template,
//     "template@Delete": "",
//     "./jcr:title": title,
//     pageName,
//     "./cq:tags@TypeHint": "String[]",
//     "./cq:tags@Delete": "",
//     "./brandSlug_override@Delete": "",
//     "./id": "",
//     "./pageTitle": "",
//     "./navTitle": "",
//     "./cq:redirectTarget": "",
//     "./cq:redirectTarget@Delete": "",
//     "./sling:alias": "",
//     "./cq:conf": "",
//     "./cq:conf@Delete": ""
//   }).toString();

//   try {
//     const response = await axios.post(url, body, {
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
//         Accept: "*/*",
//         "X-Requested-With": "XMLHttpRequest"
//       },
//       auth
//     });

//     return response.data;
//   } catch (error) {
//     console.error("Error creating AEM page:", error.response?.data || error.message);
//     throw error;
//   }
// }

async function createPage({ parentPath, template, title, pageName = "" }) {
  const url = `${AEM_DOMAIN}/libs/wcm/core/content/sites/createpagewizard/_jcr_content`;

  const body = new URLSearchParams({
    _charset_: "utf-8",
    parentPath,
    template,
    "template@Delete": "",
    "./jcr:title": title,
    pageName,
    "./cq:tags@TypeHint": "String[]",
    "./cq:tags@Delete": "",
    "./brandSlug_override@Delete": "",
    "./id": "",
    "./pageTitle": "",
    "./navTitle": "",
    "./cq:redirectTarget": "",
    "./cq:redirectTarget@Delete": "",
    "./sling:alias": "",
    "./cq:conf": "",
    "./cq:conf@Delete": ""
  }).toString();

  try {
    const response = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Accept: "*/*",
        "X-Requested-With": "XMLHttpRequest"
      },
      auth
    });

    console.log("✅ Page Created Successfully:");
    console.dir(response.data, { depth: null });
  } catch (error) {
    console.error("❌ Failed to create page:", error.response?.data || error.message);
  }
}



// Inside aemPageUtil.js (add this function alongside createPage)

async function rolloutPage({ 
  path,                  // String: Source page path (language master)
  targetPaths = [],      // Array<String>: rollout target paths
  reportSchedule = "now" // String, usually 'now'
}) {
  const url = `${AEM_DOMAIN}/bin/asynccommand`;

  // Prepare form-urlencoded body
  const body = new URLSearchParams({
    type: "page",
    "msm:targetPath": JSON.stringify(targetPaths),  // must be a JSON array string
    paras: JSON.stringify([]),                       // empty array string as in curl
    cmd: "rollout",
    path,
    operation: "asyncRollout",
    _charset_: "utf-8",
    reportSchedule
  }).toString();

  try {
    const response = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Accept: "*/*",
        "X-Requested-With": "XMLHttpRequest"
      },
      auth
    });

    console.log("✅ Rollout initiated successfully:");
    console.dir(response.data, { depth: null });
  } catch (error) {
    console.error("❌ Rollout failed:", error.response?.data || error.message);
  }
}


async function copyPage({ srcPath, destParentPath, destName, shallow = "false" }) {
  const url = `${AEM_DOMAIN}/bin/wcmcommand`;

  const form = new FormData();
  form.append("cmd", "copyPage");
  form.append("srcPath", srcPath);
  form.append("destParentPath", destParentPath);
  form.append("destName", destName);
  form.append("shallow", shallow);

  try {
    const response = await axios.post(url, form, {
      headers: {
        ...form.getHeaders(),
        Accept: "*/*",
        "X-Requested-With": "XMLHttpRequest"
      },
      auth
    });

    console.log("✅ Page copied successfully:");
    console.dir(response.data, { depth: null });
  } catch (error) {
    console.error("❌ Failed to copy page:", error.response?.data || error.message);
  }
}

async function modifyPage({ pagePath, updatedTitle }) {
  const url = `${AEM_DOMAIN}${pagePath}/_jcr_content`;

  const body = new URLSearchParams({
    "./jcr:title": updatedTitle,
    "./cq:tags@TypeHint": "String[]",
    "./cq:tags@Delete": "",
    "./hideInNav@Delete": "",
    "_charset_": "utf-8",
    "./brandSlug_override@Delete": "",
    "./id": "",
    "./pageTitle": "",
    "./navTitle": "",
    "./subtitle": "",
    "./jcr:description": "",
    "./onTime": "",
    "./onTime@TypeHint": "Date",
    "./offTime": "",
    "./offTime@TypeHint": "Date",
    "./sling:vanityPath@Delete": "",
    "./sling:redirect@Delete": "",
    "./jcr:language": "",
    "./jcr:language@Delete": "",
    "./cq:isLanguageRoot@Delete": "",
    "./cq:redirectTarget@Delete": "",
    "./cq:designPath@Delete": "",
    "./sling:alias": "",
    "./cq:conf@Delete": "",
    "./cq:allowedTemplates@Delete": "",
    "./cq:authenticationRequired@Delete": "",
    "./cq:loginPath@Delete": "",
    "./cq:exportTemplate@Delete": "",
    "./cq:canonicalUrl@Delete": "",
    "./cq:robotsTags@Delete": "",
    "./sling:sitemapRoot@Delete": "",
    "./cq:featuredimage/jcr:lastModified": "",
    "./cq:featuredimage/jcr:lastModifiedBy": "",
    "./cq:featuredimage/sling:resourceType": "core/wcm/components/image/v3/image",
    "./cq:featuredimage/alt": "",
    "./cq:featuredimage/altValueFromDAM@Delete": "",
    "./cq:featuredimage/altValueFromDAM@DefaultValue": "false",
    "./cq:featuredimage/altValueFromDAM@UseDefaultWhenMissing": "true",
    "./cq:cloudserviceconfigs@Delete": "true",
    "./cq:cloudserviceconfigs@TypeHint": "String[]",
    "./cq:contextHubPath@Delete": "",
    "./cq:contextHubSegmentsPath@Delete": "",
    "./cq:target-ambits@Delete": "true",
    "./cq:target-ambits@TypeHint": "String[]",
    "read@Delete": "",
    "modify@Delete": "",
    "delete@Delete": "",
    "replicate@Delete": "",
    "create@Delete": ""
  }).toString();

  try {
    const response = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Accept: "*/*",
        "X-Requested-With": "XMLHttpRequest"
      },
      auth
    });

    console.log("✅ Page modified successfully:");
    console.dir(response.data, { depth: null });
  } catch (error) {
    console.error("❌ Failed to modify page:", error.response?.data || error.message);
  }
}

async function replicateContent(path, cmd) {

    const url = `${AEM_DOMAIN}/bin/replicate.json`;

    const form = new FormData();
    form.append('path', path);
    form.append('cmd', cmd);

    try {
        const response = await axios.post(url, form, {
            headers: {
                ...form.getHeaders(),
                'Authorization': 'Basic ' + Buffer.from(`${AEM_USER_NAME}:${AEM_PASSWORD}`).toString('base64')
            }
        });
        console.log('Response:', response.data);
        return response.status.toString();  
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        return error.response ? error.response.status.toString() : '500';
    }
}


async function deletePage(pagePath) {
  const url = `${AEM_DOMAIN}${pagePath}`;

  const formData = new URLSearchParams();
  formData.append(":operation", "delete");

  try {
    const response = await axios.post(url, formData.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "*/*"
      },
      auth
    });

    console.log("🗑️ Page deleted successfully:");
    console.dir(response.data, { depth: null });
  } catch (error) {
    console.error("❌ Failed to delete page:", error.response?.data || error.message);
  }
}


async function relocatePage({ srcPath, destParentPath, destName, destTitle }) {
  const url = `${AEM_DOMAIN}/bin/asynccommand`;

  const body = new URLSearchParams({
    cmd: "movePage",
    integrity: "true",
    _charset_: "utf-8",
    ":status": "browser",
    srcPath,
    destParentPath,
    destName,
    operation: "asyncPageMove",
    reportSchedule: "now",
    destTitle
  }).toString();

  try {
    const response = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Accept: "*/*",
        "X-Requested-With": "XMLHttpRequest"
      },
      auth
    });

    console.log("🔀 Page moved successfully:");
    console.dir(response.data, { depth: null });
  } catch (error) {
    console.error("❌ Failed to move/rename page:", error.response?.data || error.message);
  }
}


async function rolloutByResetting({ srcPath, targetPath }) {
  const params = new URLSearchParams();
  params.append('_charset_', 'UTF-8');
  params.append('cmd', 'rollout');
  params.append('type', 'page');
  params.append('reset', 'true');
  params.append('path', srcPath);
  params.append('msm:targetPath', targetPath);

  const authHeader = 'Basic ' + Buffer.from(`${AEM_USER_NAME}:${AEM_PASSWORD}`).toString('base64');

  try {
    const response = await fetch(`${AEM_DOMAIN}/bin/wcmcommand`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: params
    });

    if (!response.ok) {
      throw new Error(`❌ Failed to rollout by resetting: ${response.status} ${response.statusText}`);
    }

    const result = await response.text(); // You may log this if needed
    console.log(`✅ Successfully triggered rollout with reset for: ${srcPath}`);
  } catch (error) {
    console.error('❌ Error in rolloutByResetting:', error.message);
  }
}



export {
  createPage,
  rolloutPage,
  copyPage,
  modifyPage,
  replicateContent,
  deletePage,
  relocatePage,
  rolloutByResetting
};
