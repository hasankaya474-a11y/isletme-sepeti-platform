import {hashPassword,verifyPassword} from "./password.mjs";
export function rotatePassword({user,currentPassword,newPassword,now=new Date().toISOString()}){
 if(!verifyPassword(currentPassword,user.passwordHash))throw new Error("CURRENT_PASSWORD_INVALID");
 if(verifyPassword(newPassword,user.passwordHash))throw new Error("PASSWORD_REUSE_FORBIDDEN");
 return {...user,passwordHash:hashPassword(newPassword),updatedAt:now};
}
export function resetPassword({user,newPassword,now=new Date().toISOString()}){return {...user,passwordHash:hashPassword(newPassword),updatedAt:now};}
