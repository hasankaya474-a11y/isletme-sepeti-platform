import {ok} from "../../../packages/contracts/src/api-envelope.mjs";import {protect} from "../../../packages/core/src/request-pipeline.mjs";
export function registerCatalogRoutes(router,{catalog,catalogAdmin,productRequests,supplierOffers}){
 const admin=h=>protect(h,{permission:"admin.configuration.manage"});
 router.register("POST","/v1/admin/catalog/products",admin(async req=>ok(catalog.createProduct({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/admin/catalog/products/review",admin(async req=>ok(catalog.transition({id:req.body.id,to:"REVIEW",actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/admin/catalog/products/publish",admin(async req=>ok(catalogAdmin.publishProduct({id:req.body.id,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/admin/catalog/categories",admin(async req=>ok(catalogAdmin.createCategory({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/admin/catalog/brands",admin(async req=>ok(catalogAdmin.createBrand({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/supplier/catalog/product-requests",protect(async req=>ok(productRequests.request({...req.body,actorId:req.auth.userId,supplierId:req.auth.membership.organizationId}),{requestId:req.requestId}),{permission:"supplier.catalog.manage"}));
 router.register("POST","/v1/supplier/catalog/offers",protect(async req=>ok(supplierOffers.create({...req.body,actorId:req.auth.userId,supplierId:req.auth.membership.organizationId}),{requestId:req.requestId}),{permission:"supplier.catalog.manage"}));
}