export class MemoryStore {
  #tables = new Map();
  table(name) { if (!this.#tables.has(name)) this.#tables.set(name,new Map()); return this.#tables.get(name); }
  insert(name,row) { const t=this.table(name); if(t.has(row.id)) throw new Error("DUPLICATE_ID"); t.set(row.id,structuredClone(row)); return structuredClone(row); }
  get(name,id) { const v=this.table(name).get(id); return v?structuredClone(v):null; }
  update(name,id,fn) { const t=this.table(name); const current=t.get(id); if(!current) throw new Error("NOT_FOUND"); const next=fn(structuredClone(current)); t.set(id,structuredClone(next)); return structuredClone(next); }
  find(name,predicate) { return [...this.table(name).values()].filter(predicate).map((row) => structuredClone(row)); }
}
