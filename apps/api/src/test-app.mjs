import {Router} from "./router.mjs";
import {registerAdminRoutes} from "./admin-routes.mjs";
import {registerChangeRoutes} from "./change-routes.mjs";
import {registerControlPlaneRoutes} from "./control-plane-routes.mjs";
import {registerHelpRoutes} from "./help-routes.mjs";
import {registerVitrinRoutes} from "./vitrin-routes.mjs";
import {registerPhase4Routes} from "./phase4-routes.mjs";
import {registerPhase5Routes} from "./phase5-routes.mjs";
import {registerPhase6Routes} from "./phase6-routes.mjs";
import {registerPhase7Routes} from "./phase7-routes.mjs";
import {registerPhase8Routes} from "./phase8-routes.mjs";
import {registerPhase9Routes} from "./phase9-routes.mjs";
import {registerPhase10Routes} from "./phase10-routes.mjs";
import {registerPhase11Routes} from "./phase11-routes.mjs";
import {registerPhase12Routes} from "./phase12-routes.mjs";
import {registerPhase13Routes} from "./phase13-routes.mjs";

export function createTestApp(deps){
  const router=new Router();
  registerAdminRoutes(router,deps);
  registerChangeRoutes(router,deps);
  if(deps.pages&&deps.seo&&deps.publication) registerControlPlaneRoutes(router,deps);
  if(deps.helpAdmin) registerHelpRoutes(router,deps);
  if(deps.pages&&deps.versions&&deps.workflow&&deps.redirects) registerVitrinRoutes(router,deps);
  if(deps.pricing&&deps.stock&&deps.reservations&&deps.delivery) registerPhase4Routes(router,deps);
  if(deps.search&&deps.productCards&&deps.buyerLists&&deps.matching&&deps.searchAdmin) registerPhase5Routes(router,deps);
  if(deps.rfqs&&deps.quotes&&deps.comparison&&deps.messages&&deps.rfqAdmin) registerPhase6Routes(router,deps);
  if(deps.carts&&deps.requisitions&&deps.approvals&&deps.policies&&deps.poReadiness&&deps.procurementAdmin) registerPhase7Routes(router,deps);
  if(deps.orderCreation&&deps.orderTransitions&&deps.outbox) registerPhase8Routes(router,deps);
  if(deps.capacity&&deps.deliveryOps&&deps.eta&&deps.receiving&&deps.rmas&&deps.deliveryAdmin) registerPhase9Routes(router,deps);
  if(deps.invoices&&deps.matching3&&deps.invoiceReview&&deps.agreements&&deps.evidenceFacade&&deps.evidence) registerPhase10Routes(router,{invoices:deps.invoices,matching:deps.matching3,invoiceReview:deps.invoiceReview,agreements:deps.agreements,evidenceFacade:deps.evidenceFacade,evidence:deps.evidence});
  if(deps.ledger&&deps.commissions&&deps.reconciliation) registerPhase11Routes(router,{ledger:deps.ledger,commissions:deps.commissions,reconciliation:deps.reconciliation});
  if(deps.metrics&&deps.reports&&deps.exports) registerPhase12Routes(router,{metrics:deps.metrics,reports:deps.reports,exports:deps.exports});
  if(deps.supportCases&&deps.disputes) registerPhase13Routes(router,{supportCases:deps.supportCases,disputes:deps.disputes});
  return router;
}
