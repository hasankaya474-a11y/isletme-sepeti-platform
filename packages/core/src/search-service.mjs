function norm(v=""){
  return String(v).toLocaleLowerCase("tr-TR").normalize("NFKD").replace(/[\u0300-\u036f]/g,"").trim();
}
function tokens(v){return norm(v).split(/\s+/).filter(Boolean);}

export class SearchService{
  constructor(store){this.store=store;}

  expandQuery(query){
    const q=norm(query), expanded=new Set(tokens(q));
    for(const s of this.store.find("searchSynonyms",x=>x.status==="ACTIVE")){
      if(q.includes(norm(s.term))) for(const t of tokens(s.synonym)) expanded.add(t);
      if(q.includes(norm(s.synonym))) for(const t of tokens(s.term)) expanded.add(t);
    }
    return [...expanded];
  }

  search({query,limit=20}){
    const q=norm(query);
    if(!q) return [];
    const ts=this.expandQuery(q);
    return this.store.find("masterProducts",x=>x.status==="PUBLISHED").map(product=>{
      const hay=norm([product.name,product.productKey,product.origin,product.baseUnit].filter(Boolean).join(" "));
      const matched=ts.filter(t=>hay.includes(t));
      const exact=hay.includes(q)?2:0;
      const score=exact+matched.length;
      const offers=this.store.find("supplierOffers",o=>o.masterProductId===product.id&&o.offerStatus==="ACTIVE");
      return {product,score,activeOfferCount:offers.length};
    }).filter(x=>x.score>0)
      .sort((a,b)=>b.score-a.score||String(a.product.name).localeCompare(String(b.product.name),"tr"))
      .slice(0,Math.max(1,Math.min(100,limit)));
  }
}
