import {
  createPage,
  rolloutPage,
  copyPage,
  modifyPage,
  replicateContent,
  deletePage,
  relocatePage,
  rolloutByResetting
} from "./aemPageUtil.js";

(async () => {
  //   await createPage({
  //     parentPath: "/content/rocket/us/en",
  //     template: "/conf/rocket/settings/wcm/templates/page-content",
  //     title: "Test Page from Util 2",
  //     pageName: "test-page-util2",
  //   });

  //   await rolloutPage({
  //     path: "/content/we-retail/language-masters/en/experience/test-page",
  //     targetPaths: ["/content/we-retail/us/en/experience/test-page"],
  //     reportSchedule: "now",
  //   });

  // await copyPage({
  //     srcPath: "/content/rocket/us/en/test-page-util",
  //     destParentPath: "/content/rocket/us/fr",
  //     destName: "legalnew",
  //     shallow: "false"
  //   });

//   await modifyPage({
//     pagePath: "/content/rocket/us/fr/legalnew",
//     updatedTitle: "Test Page from Util FR",
//   });




    // await replicateContent("/content/rocket/us/fr/legalnew", "activate"); // publish page
    // await replicateContent("/content/rocket/us/fr/legalnew", "deactivate"); // unpublish page

    // await deletePage("/content/rocket/us/fr/tobe-deleted-page");


//     await relocatePage({
//     srcPath: "/content/rocket/us/fr/test-page-updated",
//     destParentPath: "/content/rocket/us/fr",
//     destName: "test-page-updated-cmd",
//     destTitle: "Test Page Updated CMD"
//   });

// await rolloutByResetting({
//   srcPath: '/content/we-retail/language-masters/en/experience/test-page',
//   targetPath: '/content/we-retail/us/en/experience/test-page'
// });


})();
