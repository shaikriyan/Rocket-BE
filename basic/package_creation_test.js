import axios from "axios";
import FormData from "form-data";
import { configDotenv } from "dotenv";
configDotenv({ path: "../.env" });


/**
 * Creates a package in AEM's CRX Package Manager using Basic Auth
 * @param {string} packageName - Name of the package to create
 * @param {string} groupName - Group (folder) where the package will be created
 */
async function createPackage(packageName, groupName) {
  const AEM_DOMAIN = process.env.AEM_DOMAIN || 'http://localhost:4502';
  const AEM_USER_NAME = process.env.AEM_USER_NAME || 'admin';
  const AEM_PASSWORD = process.env.AEM_PASSWORD || 'admin';

  const path = `/etc/packages/${groupName}/${packageName}`;
  const url = `${AEM_DOMAIN}/crx/packmgr/service/.json${path}?cmd=create`;

  const form = new FormData();
  form.append('packageName', packageName);
  form.append('groupName', groupName);

  try {
    const response = await axios.post(url, form, {
      headers: form.getHeaders(),
      auth: {
        username: AEM_USER_NAME,
        password: AEM_PASSWORD,
      },
    });

    console.log('✅ Package created:', response.status);
    console.log(response.data);
  } catch (err) {
    console.error('❌ Package creation failed:', err.response?.status);
    console.error(err.response?.data || err.message);
  }
}


createPackage('PC_one', 'my_packages');


