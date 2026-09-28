import {createCipheriv,createDecipheriv,randomBytes} from "node:crypto";
export class AesGcmSecretBox{
 constructor(key){if(!Buffer.isBuffer(key)||key.length!==32)throw new TypeError("SECRET_KEY_MUST_BE_32_BYTES");this.key=key;}
 encrypt(value){const iv=randomBytes(12),cipher=createCipheriv("aes-256-gcm",this.key,iv);const ciphertext=Buffer.concat([cipher.update(Buffer.from(value)),cipher.final()]);return [iv.toString("base64url"),cipher.getAuthTag().toString("base64url"),ciphertext.toString("base64url")].join(".");}
 decrypt(encoded){const [iv,tag,data]=encoded.split(".").map(x=>Buffer.from(x,"base64url"));const decipher=createDecipheriv("aes-256-gcm",this.key,iv);decipher.setAuthTag(tag);return Buffer.concat([decipher.update(data),decipher.final()]).toString();}
}
