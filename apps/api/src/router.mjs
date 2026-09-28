import {fail} from "../../../packages/contracts/src/api-envelope.mjs";
export class Router{
 constructor(){this.routes=[];}
 register(method,path,handler){this.routes.push({method:method.toUpperCase(),path,handler});}
 async handle(req){const route=this.routes.find(r=>r.method===req.method?.toUpperCase()&&r.path===req.path);if(!route)return fail("NOT_FOUND","Kaynak bulunamadı",{requestId:req.requestId});try{return await route.handler(req);}catch(e){return fail(e.code??e.message??"INTERNAL","İşlem tamamlanamadı",{requestId:req.requestId});}}
}
