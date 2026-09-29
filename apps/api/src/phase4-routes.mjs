import {ok} from "../../../packages/contracts/src/api-envelope.mjs";
import {protect} from "../../../packages/core/src/request-pipeline.mjs";

export function registerPhase4Routes(router,{pricing,stock,reservations,delivery}){
 const admin=h=>protect(h,{permission:"admin.configuration.manage"});

 router.register("POST","/v1/admin/pricing/price-books",admin(async req=>ok(pricing.createPriceBook({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/admin/pricing/offer-prices",admin(async req=>ok(pricing.attachOfferPrice({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));

 router.register("POST","/v1/admin/stock/locations",admin(async req=>ok(stock.createLocation({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/admin/stock/receive",admin(async req=>ok(stock.receive({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));

 router.register("POST","/v1/admin/stock/reservations/release",admin(async req=>ok(reservations.release({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));

 router.register("POST","/v1/admin/delivery/zones",admin(async req=>ok(delivery.createZone({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/admin/delivery/calendars",admin(async req=>ok(delivery.createCalendar({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/admin/delivery/slas",admin(async req=>ok(delivery.createSla({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
}
