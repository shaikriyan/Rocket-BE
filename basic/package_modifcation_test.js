import axios from "axios";
import FormData from "form-data";
import { configDotenv } from "dotenv";
configDotenv({ path: "../.env" });



/**
 * Uploads/updates a package in AEM using Basic Auth.
 * @param {string[]} paths - List of paths like ['/content/rocket/us/en', '/content/rocket/us']
 * @param {string} packagePath - Path in JCR like /etc/packages/my_packages/Vasco.zip
 * @param {string} packageName - Name of the package
 * @param {string} groupName - Group (folder) name
 */
async function updatePackage(paths, packagePath, packageName, groupName) {
  const AEM_DOMAIN = process.env.AEM_DOMAIN || 'http://localhost:4502';
  const AEM_USER_NAME = process.env.AEM_USER_NAME || 'admin';
  const AEM_PASSWORD = process.env.AEM_PASSWORD || 'admin';

  const form = new FormData();

  // Required form fields
  form.append('path', packagePath);
  form.append('packageName', packageName);
  form.append('groupName', groupName);
  form.append('version', '');
  form.append('description', '');
  form.append('thumbnail', Buffer.from([]), { filename: '' });
  form.append('_charset_', 'UTF-8');

  // Dynamic filters
  const filterArray = paths.map((p) => ({ root: p, rules: [] }));
  form.append('filter', JSON.stringify(filterArray));

  // Optional: replicate ext-comp fields (if needed by UI logic)
//   if (paths[0]) form.append('ext-comp-1317', paths[0]);
//   if (paths[1]) form.append('ext-comp-1346', paths[1]);

  try {
    const response = await axios.post(`${AEM_DOMAIN}/crx/packmgr/update.jsp`, form, {
      headers: form.getHeaders(),
      auth: {
        username: AEM_USER_NAME,
        password: AEM_PASSWORD,
      },
    });

    console.log('✅ Package update response:', response.status);
    console.log(response.data);
  } catch (err) {
    console.error('❌ Package update failed:', err.response?.status);
    console.error(err.response?.data || err.message);
  }
}


updatePackage(
  ['/content/rocket/us/en', '/content/rocket/us', '/content/rocket'],
  '/etc/packages/my_packages/PC_one.zip',
  'PC_one',
  'my_packages'
);

