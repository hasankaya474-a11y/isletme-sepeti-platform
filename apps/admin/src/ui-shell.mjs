import {ADMIN_NAVIGATION} from "./navigation.mjs";
export function adminShell({active="Genel Bakış",title="Komutan Admin",content=null,user=null}={}){
 return {type:"admin-shell",title,user,navigation:ADMIN_NAVIGATION.map(label=>({label,active:label===active})),content};
}
export function identityPage({memberships=[],sessions=[],securityEvents=[],loading=false,error=null}={}){
 return {route:"/uyelik-yetki",title:"Üyelik & Yetki",loading,error,toolbar:[{id:"invite",label:"Kullanıcı Davet Et",requires:"admin.configuration.manage"}],tabs:[{id:"memberships",label:"Üyelikler",count:memberships.length},{id:"sessions",label:"Oturum & Cihazlar",count:sessions.length},{id:"security",label:"Güvenlik Olayları",count:securityEvents.length}],data:{memberships,sessions,securityEvents}};
}
