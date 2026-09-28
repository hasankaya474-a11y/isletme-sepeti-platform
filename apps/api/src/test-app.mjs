import {Router} from "./router.mjs";
import {registerAdminRoutes} from "./admin-routes.mjs";
import {registerChangeRoutes} from "./change-routes.mjs";
import {registerControlPlaneRoutes} from "./control-plane-routes.mjs";
import {registerHelpRoutes} from "./help-routes.mjs";
import {registerVitrinRoutes} from "./vitrin-routes.mjs";

export function createTestApp(deps){
  const router=new Router();
  registerAdminRoutes(router,deps);
  registerChangeRoutes(router,deps);
  if(deps.pages&&deps.seo&&deps.publication) registerControlPlaneRoutes(router,deps);
  if(deps.helpAdmin) registerHelpRoutes(router,deps);
  if(deps.pages&&deps.versions&&deps.workflow&&deps.redirects) registerVitrinRoutes(router,deps);
  return router;
}
