import {
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
}  from './aemPackageManager.js';

(async () => {
  const packageName = 'testing_package';
  const groupName = 'my_packages';
  const contentPaths = ['/content/rocket/us/en', '/content/rocket/us'];

//   await createPackage(packageName, groupName);
//   await updateFilters(packageName, groupName, contentPaths);
//   await buildPackage(packageName, groupName);
//   await downloadPackage(packageName, groupName, `./${packageName}.zip`);
  // Optional: Upload it back
  // await uploadPackage(`C:/Users/user/Downloads/testing_package.zip`); // upload + no install 
  // await uploadPackage(`C:/Users/user/Downloads/testing_package.zip`, true); // upload + install 
  // await installPackage(`/etc/packages/my_packages/testing_package.zip`); // installing by providing the package path
  // await installPackageByName(`testing_package`); // installing package with the help of package name
  // await deletePackage(`testing_package`); // delete package with the help of package name
  // await uninstallPackage(`testing_package`); // uninstall package with the help of package name
  // await replicatePackage(`testing_package`); // replicate package with the help of package name
  // await reinstallPackage(`testing_package`); // Re-installing package with the help of package name
  
  await listPackages(); //List of Packages

})();





/*


utils -> aemPackageManagerUtil.js
		 aemPageUtil (create, rollout, copy, modify, move, replicate (unpublish, publish) , delete
		 aemReplicationUtil (publish, unpublish)
		 aemComponentUtil (create a new component -> by copy an existing component from core components)
		 


Will need to segrate the controllers & routers as well..



*/
