import { publish, unPublish } from "./aemReplicationUtil.js";


(async ()=>{
    // await publish("/content/rocket/us/fr/test-page-updated-cmd");
    await unPublish("/content/rocket/us/fr/test-page-updated-cmd");
})();
