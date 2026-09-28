export function createIdentityUiController({client,view}){
 let busy=false;const run=async(label,fn)=>{if(busy)return;busy=true;view.setLoading(true,label);try{const data=await fn();view.announce(label+" tamamlandı");return data;}catch(e){view.showError(e.code??"REQUEST_FAILED",e.message);throw e;}finally{busy=false;view.setLoading(false);}};
 return {
  invite:input=>run("Kullanıcı daveti",()=>client.invite(input)),
  revokeSessions:userId=>run("Oturum kapatma",()=>client.revokeAllSessions(userId)),
  requestRoleChange:input=>run("Rol ve kapsam değişikliği",()=>client.requestRoleChange(input)),
  approve:id=>run("Değişiklik onayı",()=>client.approveChange(id)),
  reject:(id,reason)=>run("Değişiklik reddi",()=>client.rejectChange(id,reason))
 };
}