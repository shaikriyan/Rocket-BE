import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import os from 'os';
import path from 'path';
import { configDotenv } from "dotenv";
configDotenv({ path: "../.env" });


const AEM_DOMAIN = process.env.AEM_DOMAIN || 'http://localhost:4502';
const AEM_USER_NAME = process.env.AEM_USER_NAME || 'admin';
const AEM_PASSWORD = process.env.AEM_PASSWORD || 'admin';

const auth = { username: AEM_USER_NAME, password: AEM_PASSWORD };

/**
 * 1. Create a package
 */
async function createPackage(packageName, groupName) {
  const path = `/etc/packages/${groupName}/${packageName}`;
  const url = `${AEM_DOMAIN}/crx/packmgr/service/.json${path}?cmd=create`;

  const form = new FormData();
  form.append('packageName', packageName);
  form.append('groupName', groupName);

  const response = await axios.post(url, form, { headers: form.getHeaders(), auth });
  console.log('✅ Package created:', response.data.path);
}

/**
 * 2. Update filters
 */
async function updateFilters(packageName, groupName, paths = []) {
  const url = `${AEM_DOMAIN}/crx/packmgr/update.jsp`;
  const fullPath = `/etc/packages/${groupName}/${packageName}.zip`;

  const form = new FormData();
  form.append('path', fullPath);
  form.append('packageName', packageName);
  form.append('groupName', groupName);
  form.append('version', '');
  form.append('description', '');
  form.append('thumbnail', Buffer.from([]), { filename: '' });
  form.append('_charset_', 'UTF-8');

  const filterArray = paths.map((p) => ({ root: p, rules: [] }));
  form.append('filter', JSON.stringify(filterArray));

  const response = await axios.post(url, form, { headers: form.getHeaders(), auth });
  console.log('✅ Filters updated.');
}

/**
 * 3. Build the package
 */
async function buildPackage(packageName, groupName) {
  const path = `/etc/packages/${groupName}/${packageName}.zip`;
  const url = `${AEM_DOMAIN}/crx/packmgr/service/.json${path}?cmd=build`;

  const response = await axios.post(url, null, { auth });
  console.log('✅ Package built:', response.data);
}

/**
 * 4. Download the package ZIP
 */
// async function downloadPackage(packageName, groupName, outputPath = './downloadedPackage.zip') {
//   const url = `${AEM_DOMAIN}/etc/packages/${groupName}/${packageName}.zip`;

//   const response = await axios.get(url, {
//     responseType: 'stream',
//     auth,
//   });

//   const writer = fs.createWriteStream(outputPath);
//   response.data.pipe(writer);

//   return new Promise((resolve, reject) => {
//     writer.on('finish', () => {
//       console.log('✅ Package downloaded to', outputPath);
//       resolve();
//     });
//     writer.on('error', reject);
//   });
// }



async function downloadPackage(packageName, groupName) {
  const packagePath = `/etc/packages/${groupName}/${packageName}.zip`;
  const url = `${AEM_DOMAIN}${packagePath}`;

  // 🖥️ Downloads folder path
  const downloadsDir = path.join(os.homedir(), 'Downloads');
  const localFilePath = path.join(downloadsDir, `${packageName}.zip`);

  const response = await axios.get(url, {
    auth,
    responseType: 'stream',
  });

  const writer = fs.createWriteStream(localFilePath);

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', () => {
      console.log(`✅ Package downloaded to: ${localFilePath}`);
      resolve();
    });
    writer.on('error', reject);
  });
}



/**
 * 5. Upload the package (optional)
 */
async function uploadPackage(filePath, install = false) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File does not exist at path: ${filePath}`);
    return;
  }

  const fileName = path.basename(filePath); // e.g., testmal.zip
  const url = `${AEM_DOMAIN}/crx/packmgr/service.jsp`;

  const form = new FormData();
  form.append('file', fs.createReadStream(filePath)); // ✅ key = file
  form.append('force', 'true');                        // ✅ force overwrite
  form.append('name', fileName);                       // ✅ matches curl
  form.append('install', install ? 'true' : 'false');  // ✅ based on input

  try {
    const response = await axios.post(url, form, {
      auth,
      headers: form.getHeaders(),
      maxBodyLength: Infinity,
    });

    console.log('✅ Package uploaded:', response.data);
  } catch (err) {
    console.error('❌ Upload failed:', err.response?.data || err.message);
  }
}


 async function installPackage(packagePath) {
  // Construct the URL exactly as in curl (note .json endpoint)
  const url = `${AEM_DOMAIN}/crx/packmgr/service/.json${packagePath}`;
  
  const form = new URLSearchParams();
  form.append('cmd', 'install');

  try {
    const response = await axios.post(url, form.toString(), {
      auth,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    console.log('✅ Package installed:', response.data);
  } catch (err) {
    console.error('❌ Install failed:', err.response?.data || err.message);
  }
}





/**
 * Install a package in AEM by name (and optional group)
 *
 * @param {string} packageName - Package name, with or without .zip
 * @param {string} [groupName='my_packages'] - Optional group name
 */
async function installPackageByName(packageName, groupName = 'my_packages') {
  // Ensure packageName ends with .zip
  const zipFileName = packageName.endsWith('.zip')
    ? packageName
    : `${packageName}.zip`;

  const packagePath = `/etc/packages/${groupName}/${zipFileName}`;
  const url = `${AEM_DOMAIN}/crx/packmgr/service/.json${packagePath}`;

  const form = new URLSearchParams();
  form.append('cmd', 'install');

  try {
    const response = await axios.post(url, form.toString(), {
      auth,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log('✅ Package installed:', response.data);
  } catch (err) {
    console.error('❌ Install failed:', err.response?.data || err.message);
  }
}



async function deletePackage(packageName, groupName = 'my_packages') {
  const zipFileName = packageName.endsWith('.zip') ? packageName : `${packageName}.zip`;
  const packagePath = `/etc/packages/${groupName}/${zipFileName}`;
  const url = `${AEM_DOMAIN}/crx/packmgr/service/script.html${packagePath}`;

  const form = new FormData();
  form.append('cmd', 'delete');

  try {
    const response = await axios.post(url, form, {
      auth,
      headers: {
        ...form.getHeaders(),
      },
    });

    console.log('🗑️  Package deleted:', response.status, response.statusText);
  } catch (error) {
    console.error('❌ Delete failed:', error.response?.status, error.response?.data || error.message);
  }
}



async function uninstallPackage(packageName, groupName = 'my_packages') {
  const zipFileName = packageName.endsWith('.zip') ? packageName : `${packageName}.zip`;
  const packagePath = `/etc/packages/${groupName}/${zipFileName}`;
  const url = `${AEM_DOMAIN}/crx/packmgr/service/script.html${packagePath}`;

  const form = new FormData();
  form.append('cmd', 'uninstall');

  try {
    const response = await axios.post(url, form, {
      auth,
      headers: {
        ...form.getHeaders(),
      },
    });

    console.log('📦 Package uninstalled:', response.status, response.statusText);
  } catch (error) {
    console.error('❌ Uninstall failed:', error.response?.status, error.response?.data || error.message);
  }
}

async function replicatePackage(packageName, groupName = 'my_packages') {
  const zipFileName = packageName.endsWith('.zip') ? packageName : `${packageName}.zip`;
  const packagePath = `/etc/packages/${groupName}/${zipFileName}`;
  const url = `${AEM_DOMAIN}/crx/packmgr/service/script.html${packagePath}`;

  const form = new FormData();
  form.append('cmd', 'replicate');
  form.append('pid', 'ext-gen1069'); // UI-specific, required
  form.append('callback', 'window.parent.Ext.Ajax.Stream.callback');

  try {
    const response = await axios.post(url, form, {
      auth,
      headers: {
        ...form.getHeaders(),
      },
    });

    console.log('📦 Package replicated:', response.status, response.statusText);
  } catch (error) {
    console.error('❌ Replicate failed:', error.response?.status, error.response?.data || error.message);
  }
}


// re-install looks almost simimlar to install method..
async function reinstallPackage(packageName, groupName = 'my_packages') {
  const zipFileName = packageName.endsWith('.zip') ? packageName : `${packageName}.zip`;
  const packagePath = `/etc/packages/${groupName}/${zipFileName}`;
  const url = `${AEM_DOMAIN}/crx/packmgr/service/script.html${packagePath}`;

  const form = new FormData();
  form.append('cmd', 'install');
  form.append('extractOnly', 'false');
  form.append('autosave', '1024');
  form.append('recursive', 'true');
  form.append('acHandling', ''); // empty string as per your curl
  form.append('dependencyHandling', 'required');
  // form.append('pid', 'ext-gen1247'); // UI-generated param, required
  // form.append('callback', 'window.parent.Ext.Ajax.Stream.callback');

  try {
    const response = await axios.post(url, form, {
      auth,
      headers: {
        ...form.getHeaders(),
      },
    });

    console.log('🔄 Package reinstalled:', response.status, response.statusText);
  } catch (error) {
    console.error('❌ Reinstall failed:', error.response?.status, error.response?.data || error.message);
  }
}


const listPackages = async () => {
  const url = `${process.env.AEM_DOMAIN}/crx/packmgr/list.jsp`;
  console.log("url : ", url);
  try {
    const response = await axios.get(url, {
      auth
    });

    console.log('📦 Package List:\n', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('❌ Failed to fetch package list:', error.message);
  }
};


export {
  createPackage,
  updateFilters,
  buildPackage,
  downloadPackage,
  uploadPackage,
  installPackage,
  installPackageByName,
  deletePackage,
  uninstallPackage,
  replicatePackage,
  reinstallPackage,
  listPackages
};
