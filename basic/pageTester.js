import {
  createPage,
  rolloutPage,
  copyPage,
  modifyPage,
  replicateContent,
  deletePage,
  relocatePage,
  rolloutByResetting
} from "./aemPageUtil2.js";

(async () => {
    // await createPage({
    //   parentPath: "/content/rocket/us/fr",
    //   template: "/conf/rocket/settings/wcm/templates/page-content",
    //   title: "Final Testing",
    //   pageName: "final-testing",
    // });

    // await rolloutPage({
    //   path: "/content/we-retail/language-masters/en/experience/test-page",
    //   targetPaths: ["/content/we-retail/us/en/experience/test-page"],
    //   reportSchedule: "now",
    // });

//   await copyPage({
//       srcPath: "/content/rocket/us/en/final-testing",
//       destParentPath: "/content/rocket/us/fr",
//       destName: "final-test-copy",
//       shallow: "false"
//     });

//   await modifyPage({
//     pagePath: "/content/rocket/us/fr/final-test-copy",
//     updatedTitle: "Final Test Copy",
//   });




    // await replicateContent("/content/rocket/us/fr/final-test-copy", "activate"); // publish page
    // await replicateContent("/content/rocket/us/fr/final-test-copy", "deactivate"); // unpublish page

    // await deletePage("/content/rocket/us/fr/final-testing");


//     await relocatePage({
//     srcPath: "/content/rocket/us/fr/final-test-copy",
//     destParentPath: "/content/rocket/us/fr",
//     destName: "final-test",
//     destTitle: "Final Test"
//   });

// await rolloutByResetting({
//   srcPath: '/content/we-retail/language-masters/en/experience/test-page',
//   targetPath: '/content/we-retail/us/en/experience/test-page'
// });


})();
