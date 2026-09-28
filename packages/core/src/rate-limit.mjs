export class SlidingWindowLimiter {
  #hits=new Map();
  constructor({limit=5,windowMs=15*60*1000}={}){this.limit=limit;this.windowMs=windowMs;}
  check(key,now=Date.now()){
    const cutoff=now-this.windowMs;
    const recent=(this.#hits.get(key)??[]).filter(t=>t>cutoff);
    if(recent.length>=this.limit) return {allowed:false,retryAfterMs:Math.max(0,recent[0]+this.windowMs-now)};
    recent.push(now); this.#hits.set(key,recent);
    return {allowed:true,retryAfterMs:0};
  }
}
