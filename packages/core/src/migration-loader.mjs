import {readdir,readFile} from "node:fs/promises";import {join} from "node:path";
export async function loadMigrations(dir){const names=(await readdir(dir)).filter(x=>/^\d+_.+\.sql$/.test(x)).sort();return Promise.all(names.map(async name=>({version:name.split("_")[0],name,sql:await readFile(join(dir,name),"utf8")})));}
