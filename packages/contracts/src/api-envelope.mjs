export function ok(data,{requestId=null}={}){return {ok:true,data,error:null,requestId};}
export function fail(code,message,{requestId=null,details=null}={}){return {ok:false,data:null,error:{code,message,details},requestId};}
