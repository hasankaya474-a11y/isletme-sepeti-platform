import fs from 'node:fs';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const write=(p,s)=>fs.writeFileSync(new URL('../'+p,import.meta.url),s,'utf8');
const deniz=read('src/deniz-worker.js'),zaman=read('src/zaman-admin-worker.js');
for(const [name,source] of [['DENIZ',deniz],['ZAMAN',zaman]]){
 if((source.match(/export default/g)||[]).length!==1)throw Error(name+'_SINGLE_EXPORT_REQUIRED');
 if(/^import\s/m.test(source))throw Error(name+'_RELATIVE_IMPORT_NOT_ALLOWED');
}
for(const path of ['dist/deniz-worker.single.js','dist/deniz-worker.monolithic.final.js','exports/OKYANUS_DENIZ_CURRENT_FINAL.txt','exports/OKYANUS_DENIZ_FINAL_2026-10-02.txt'])write(path,deniz);
for(const path of ['dist/zaman-admin-worker.single.js','exports/OKYANUS_ZAMAN_ADMIN_CURRENT_FINAL.txt','exports/OKYANUS_ZAMAN_FINAL_2026-10-02.txt'])write(path,zaman);
console.log('R32: canonical standalone sources and current delivery files synchronized');
