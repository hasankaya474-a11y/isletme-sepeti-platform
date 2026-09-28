export class MigrationRunner{
 constructor(db){this.db=db;}
 async ensureTable(){await this.db.exec("CREATE TABLE IF NOT EXISTS schema_migrations(version TEXT PRIMARY KEY, applied_at TEXT NOT NULL)");}
 async applied(){await this.ensureTable();return new Set((await this.db.all("SELECT version FROM schema_migrations")).map(x=>x.version));}
 async run(migrations,now=new Date().toISOString()){const done=await this.applied();for(const m of migrations){if(done.has(m.version))continue;await this.db.transaction(async()=>{await this.db.exec(m.sql);await this.db.run("INSERT INTO schema_migrations(version,applied_at) VALUES(?,?)",[m.version,now]);});}return true;}
}
