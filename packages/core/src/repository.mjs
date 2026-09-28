export class Repository {
  constructor(store,table){this.store=store;this.table=table;}
  create(row){return this.store.insert(this.table,row);}
  get(id){return this.store.get(this.table,id);}
  update(id,fn){return this.store.update(this.table,id,fn);}
  find(predicate){return this.store.find(this.table,predicate);}
}
