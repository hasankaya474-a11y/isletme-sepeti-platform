export const IDENTITY_ACTIONS=Object.freeze([
 {id:"invite",label:"Kullanıcı Davet Et",permission:"admin.configuration.manage",mfa:true},
 {id:"suspend",label:"Üyeliği Askıya Al",permission:"admin.configuration.manage",mfa:true},
 {id:"revoke",label:"Üyeliği İptal Et",permission:"admin.configuration.manage",mfa:true},
 {id:"role-change",label:"Rol / Kapsam Değiştir",permission:"admin.configuration.manage",mfa:true,fourEyes:true},
 {id:"revoke-sessions",label:"Tüm Oturumları Kapat",permission:"admin.configuration.manage",mfa:true}
]);
