export const BLOCK_SCHEMAS=Object.freeze({
 HERO:{required:["title"],fields:["title","subtitle","desktopMediaId","mobileMediaId","buttonLabel","buttonHref"]},
 TEXT:{required:["body"],fields:["heading","body"]},IMAGE:{required:["mediaId","altText"],fields:["mediaId","altText","caption"]},
 CATEGORY_GRID:{required:[],fields:["heading","categoryIds","limit"]},PRODUCT_SHOWCASE:{required:[],fields:["heading","mode","productIds","categoryId","limit","sponsored"]},
 BANNER:{required:["desktopMediaId"],fields:["desktopMediaId","mobileMediaId","href","altText"]},CTA:{required:["label","href"],fields:["heading","body","label","href"]},
 FAQ:{required:["items"],fields:["heading","items"]},FORM:{required:["formKey"],fields:["heading","formKey","successMessage"]},HELP:{required:["helpKey"],fields:["helpKey","heading"]}
});
export function validateBlock(type,payload={}){const s=BLOCK_SCHEMAS[type];if(!s)return ["BLOCK_TYPE_FORBIDDEN"];const e=[];for(const k of s.required)if(payload[k]===undefined||payload[k]===null||payload[k]==="")e.push("REQUIRED_"+k.toUpperCase());for(const k of Object.keys(payload))if(!s.fields.includes(k))e.push("FIELD_FORBIDDEN_"+k.toUpperCase());return e;}